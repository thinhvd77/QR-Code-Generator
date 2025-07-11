document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const urlInput = document.getElementById("url-input");
  const fileInput = document.getElementById("file-input");
  const logoInput = document.getElementById("logo-input");
  const removeLogoBtn = document.getElementById("remove-logo-btn");
  const logoFilename = document.getElementById("logo-filename");
  const generateBtn = document.getElementById("generate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const qrCodeContainer = document.getElementById("qr-code-container");
  const errorMessage = document.getElementById("error-message");

  let currentTab = "url";
  let logoFile = "./logo.png";
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  // Initialize QR Code Styling instance
  const qrCode = new QRCodeStyling({
    width: 500,
    height: 500,
    type: "canvas",
    dotsOptions: {
      color: "#343a40",
      type: "rounded",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
      imageSize: 0.5,
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#960000",
    },
    cornersDotOptions: {
      type: "dot",
      color: "#960000",
    },
  });

  // --- Event Listeners ---

  // Tab switching
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      updateTabs();
    });
  });

  // Generate button click
  generateBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission/page reload
    handleGenerate();
  });

  // Download button click
  downloadBtn.addEventListener("click", () => {
    qrCode.download({ name: "qr-code", extension: "png" });
  });

  // --- Functions ---

  function updateTabs() {
    tabBtns.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.tab === currentTab)
    );
    tabContents.forEach((content) =>
      content.classList.toggle("active", content.id === `${currentTab}-content`)
    );
    clearError();
    // Reset inputs when switching tabs for a cleaner UX
    urlInput.value = "";
    fileInput.value = "";
  }

  async function handleGenerate() {
    clearError();
    setLoading(true);

    try {
      console.log("handleGenerate called.");

      const data = await getData();
      console.log("Returned data from getData():", data);

      if (!data || typeof data !== "string" || !/^https?:\/\//.test(data)) {
        showError("Failed to generate QR code: invalid or missing link.");
        setLoading(false);
        return;
      }

      // Use logo.png in public as default logo
      const logoUrl = "logo.png";
      const options = { data, image: logoUrl };

      qrCode.update(options);
      qrCodeContainer.innerHTML = "";
      qrCode.append(qrCodeContainer);
      downloadBtn.style.display = "block";
    } catch (error) {
      console.error("Error in handleGenerate():", error);
      showError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function getData() {
    if (currentTab === "url") {
      const url = urlInput.value.trim();
      if (!url) {
        showError("Please enter a valid URL.");
        return null;
      }
      return url;
    } else if (currentTab === "file") {
      const file = fileInput.files[0];
      if (!file) {
        showError("Please select a file.");
        return null;
      }
      if (file.size > MAX_FILE_SIZE) {
        showError(`File too large. Max: ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
        return null;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        console.log("Upload response:", result);

        if (!response.ok) {
          showError(result.error || "Failed to upload file.");
          return null;
        }

        return result.link;
      } catch (error) {
        console.error("Error uploading file:", error);
        showError("Error uploading file to server.");
        return null;
      }
    }
  }

  function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    generateBtn.textContent = isLoading ? "Generating..." : "Generate QR Code";
    if (isLoading) {
      downloadBtn.style.display = "none";
    }
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }

  // Initial setup
  updateTabs();
});
