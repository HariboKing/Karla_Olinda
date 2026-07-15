function getContactFieldValue(form, selector) {
  const field = form.querySelector(selector);
  return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement
    ? field.value.trim()
    : "";
}

function setContactFieldInvalid(field, isInvalid) {
  field?.closest(".form-field")?.classList.toggle("is-invalid", isInvalid);
}

function setupDirectContactForm() {
  const form = document.querySelector("[data-direct-contact-form]");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const section = form.closest(".contact-form-section");
  const nameField = form.querySelector("[data-contact-name]");
  const emailField = form.querySelector("[data-contact-email]");
  const phoneField = form.querySelector("[data-contact-phone]");
  const lessonField = form.querySelector("[data-contact-lessons]");
  const phoneRequirement = form.querySelector("[data-phone-requirement]");
  const error = form.querySelector("[data-contact-error]");
  const submitButton = form.querySelector("[data-contact-submit]");
  const success = document.querySelector("[data-contact-success]");

  if (
    !(nameField instanceof HTMLInputElement) ||
    !(emailField instanceof HTMLInputElement) ||
    !(phoneField instanceof HTMLInputElement) ||
    !(lessonField instanceof HTMLSelectElement) ||
    !(submitButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const setError = (message) => {
    if (!(error instanceof HTMLElement)) {
      return;
    }

    error.textContent = message;
    error.hidden = false;
  };

  const clearError = () => {
    if (error instanceof HTMLElement) {
      error.hidden = true;
    }
  };

  const updatePhoneRequirement = () => {
    const requiresPhone = lessonField.value === "Yes";
    phoneField.required = requiresPhone;

    if (phoneRequirement instanceof HTMLElement) {
      phoneRequirement.textContent = requiresPhone ? "Required" : "Only for lessons";
    }

    return requiresPhone;
  };

  const validateContactForm = () => {
    const requiresPhone = updatePhoneRequirement();
    nameField.setCustomValidity("");
    emailField.setCustomValidity("");
    phoneField.setCustomValidity("");

    const hasName = nameField.value.trim() !== "";
    const hasEmail = emailField.value.trim() !== "";
    const hasValidEmail = emailField.validity.valid;
    const hasPhone = phoneField.value.trim() !== "";
    const phoneIsValid = !requiresPhone || hasPhone;

    nameField.setCustomValidity(hasName ? "" : "Please fill in your name.");
    emailField.setCustomValidity(hasEmail && hasValidEmail ? "" : "Please fill in a valid email address.");
    phoneField.setCustomValidity(phoneIsValid ? "" : "Please fill in your phone number for lesson inquiries.");

    setContactFieldInvalid(nameField, !hasName);
    setContactFieldInvalid(emailField, !hasEmail || !hasValidEmail);
    setContactFieldInvalid(phoneField, !phoneIsValid);

    if (hasName && hasEmail && hasValidEmail && phoneIsValid) {
      clearError();
      return true;
    }

    setError("Please fill in your name and email address. Phone number is required for lesson inquiries.");
    return false;
  };

  [nameField, emailField, phoneField, lessonField].forEach((field) => {
    field.addEventListener("input", validateContactForm);
    field.addEventListener("change", validateContactForm);
  });

  updatePhoneRequirement();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateContactForm() || !form.reportValidity()) {
      form.reportValidity();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    clearError();

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch(form.action, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("The message could not be sent.");
      }

      form.reset();
      updatePhoneRequirement();
      section?.classList.add("is-complete");

      if (success instanceof HTMLElement) {
        success.hidden = false;
        success.focus();
      }
    } catch (error) {
      setError("The message could not be sent. Please try again or email info@jovka.org directly.");
      submitButton.disabled = false;
      submitButton.textContent = "Send message";
    }
  });
}

setupDirectContactForm();
