// document.addEventListener("DOMContentLoaded", () => {
//     const tabBtns = document.querySelectorAll(".tab-btn");
//     const tabContents = document.querySelectorAll(".tab-content");
//     const generateBtn = document.getElementById("generate-btn");
//     const downloadBtn = document.getElementById("download-btn");
//     const qrCodeContainer = document.getElementById("qr-code-container");
//     const urlInput = document.getElementById("url-input");
//     const fileInput = document.getElementById("file-input");
//     const messageArea = document.getElementById("message-area");
//     const btnText = document.getElementById("btn-text");
//     const btnSpinner = document.getElementById("btn-spinner");

//     const placeholder = qrCodeContainer.innerHTML;
//     let qrCodeInstance = null;
//     let activeTab = "url";

//     // --- SCRIPT ĐÃ SỬA LỖI ---
//     tabBtns.forEach((btn) => {
//         btn.addEventListener("click", () => {
//             activeTab = btn.dataset.tab;

//             // Cập nhật trạng thái active cho các nút tab
//             tabBtns.forEach((b) => b.classList.remove("active"));
//             btn.classList.add("active");

//             // Ẩn tất cả các vùng nội dung
//             tabContents.forEach((content) => {
//                 content.classList.remove("active");
//             });

//             // Hiển thị vùng nội dung tương ứng
//             const targetContent = document.getElementById(
//                 `${activeTab}-content`
//             );
//             if (targetContent) {
//                 targetContent.classList.add("active");
//             }

//             clearInputsAndReset();
//         });
//     });

//     const generateQRCode = async () => {
//         setLoading(true);
//         let data = "";
//         if (activeTab === "url") {
//             data = urlInput.value.trim();
//             if (!data) {
//                 showMessage("Vui lòng nhập URL hoặc văn bản.", "error");
//                 return;
//             }
//         } else {
//             const file = fileInput.files[0];
//             if (!file) {
//                 showMessage("Vui lòng chọn một file.", "error");
//                 return;
//             }
//             try {
//                 const formData = new FormData();
//                 formData.append("file", file);
//                 const response = await fetch("/upload", {
//                     method: "POST",
//                     body: formData,
//                 });
//                 const result = await response.json();
//                 console.log("Upload response:", result);

//                 if (!response.ok) {
//                     showError(result.error || "Failed to upload file.");
//                     return null;
//                 }
//                 data = result.link;
//                 // return data;
//             } catch (error) {
//                 console.error("Error uploading file:", error);
//                 showError("Error uploading file to server.");
//                 return null;
//             }
//         }
//         clearMessage();

//         try {
//             qrCodeInstance = new QRCodeStyling({
//                 width: 500,
//                 height: 500,
//                 type: "canvas",
//                 data: data,
//                 dotsOptions: { color: "#000000", type: "rounded" },
//                 backgroundOptions: { color: "#ffffff" },
//                 cornersSquareOptions: {
//                     type: "extra-rounded",
//                     color: "#000000",
//                 },
//                 imageOptions: {
//                     crossOrigin: "anonymous",
//                     margin: 5,
//                     imageSize: 0.5,
//                 },
//             });

//             const logoUrl = "logo.png";
//             const options = { data, image: logoUrl };

//             qrCodeInstance.update(options);

//             qrCodeContainer.innerHTML = "";
//             qrCodeContainer.classList.add("has-code");
//             qrCodeInstance.append(qrCodeContainer);
//             downloadBtn.style.display = "flex";
//         } catch (err) {
//             console.error(err);
//             showMessage(
//                 "Không thể tạo mã QR. Dữ liệu có thể quá lớn.",
//                 "error"
//             );
//             resetOutput();
//         } finally {
//             setLoading(false);
//         }
//     };

//     generateBtn.addEventListener("click", generateQRCode);

//     downloadBtn.addEventListener("click", () => {
//         if (qrCodeInstance) {
//             qrCodeInstance.download({ name: "qr-code", extension: "png" });
//         }
//     });

//     function setLoading(isLoading) {
//         const icon = generateBtn.querySelector("svg");
//         generateBtn.disabled = isLoading;

//         if (isLoading) {
//             generateBtn.classList.add("is-loading");
//             if (icon) icon.style.display = "none";
//             btnSpinner.style.display = "block";
//             btnText.textContent = "Đang tạo mã...";
//         } else {
//             generateBtn.classList.remove("is-loading");
//             if (icon) icon.style.display = "block";
//             btnSpinner.style.display = "none";
//             btnText.textContent = "Tạo mã QR";
//         }
//     }

//     function showMessage(msg, type = "error") {
//         messageArea.textContent = msg;
//         messageArea.className = `message ${type}`;
//         messageArea.style.display = "block";
//     }

//     function clearMessage() {
//         messageArea.style.display = "none";
//     }

//     function resetOutput() {
//         qrCodeContainer.innerHTML = placeholder;
//         qrCodeContainer.classList.remove("has-code");
//         downloadBtn.style.display = "none";
//     }

//     function clearInputsAndReset() {
//         urlInput.value = "";
//         fileInput.value = "";
//         resetOutput();
//         clearMessage();
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const generateBtn = document.getElementById("generate-btn");
    const downloadBtn = document.getElementById("download-btn");
    const qrCodeContainer = document.getElementById("qr-code-container");
    const urlInput = document.getElementById("url-input");
    const fileInput = document.getElementById("file-input");

    // WiFi Inputs
    const wifiSsidInput = document.getElementById("wifi-ssid");
    const wifiPasswordInput = document.getElementById("wifi-password");
    const wifiEncryptionSelect = document.getElementById("wifi-encryption");
    const togglePasswordBtn = document.getElementById("toggle-password-btn");

    const messageArea = document.getElementById("message-area");
    const btnText = document.getElementById("btn-text");
    const btnSpinner = document.getElementById("btn-spinner");

    const placeholder = qrCodeContainer.innerHTML;
    let qrCodeInstance = null;
    let activeTab = "url";

    // --- SCRIPT ĐÃ SỬA LỖI ---
    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            activeTab = btn.dataset.tab;

            // Cập nhật trạng thái active cho các nút tab
            tabBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            // Ẩn tất cả các vùng nội dung
            tabContents.forEach((content) => {
                content.classList.remove("active");
            });

            // Hiển thị vùng nội dung tương ứng
            const targetContent = document.getElementById(
                `${activeTab}-content`
            );
            if (targetContent) {
                targetContent.classList.add("active");
            }

            clearInputsAndReset();
        });
    });

    const generateQRCode = async () => {
        setLoading(true);
        let data = "";

        try {
            if (activeTab === "url") {
                data = urlInput.value.trim();
                if (!data) {
                    throw new Error("Vui lòng nhập URL hoặc văn bản.");
                }
            } else if (activeTab === "wifi") {
                const ssid = wifiSsidInput.value.trim();
                const password = wifiPasswordInput.value;
                const encryption = wifiEncryptionSelect.value;

                if (!ssid) {
                    throw new Error("Vui lòng nhập tên mạng (SSID).");
                }

                // Format the Wi-Fi string according to the specification
                data = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
            } else if (activeTab === "file") {
                const file = fileInput.files[0];
                if (!file) {
                    throw new Error("Vui lòng chọn một file.");
                }
                const formData = new FormData();
                formData.append("file", file);
                const response = await fetch("/upload", {
                    method: "POST",
                    body: formData,
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Failed to upload file.");
                }
                data = result.link;
            }

            clearMessage();
            createQRCode(data);
        } catch (error) {
            console.error("Error:", error);
            showMessage(error.message, "error");
            resetOutput();
        } finally {
            setLoading(false);
        }
    };

    function createQRCode(data) {
        try {
            qrCodeInstance = new QRCodeStyling({
                width: 500,
                height: 500,
                type: "canvas",
                data: data,
                dotsOptions: { color: "#000000", type: "rounded" },
                backgroundOptions: { color: "#ffffff" },
                cornersSquareOptions: {
                    type: "extra-rounded",
                    color: "#000000",
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 5,
                    imageSize: 0.5,
                },
            });

            const logoUrl = "logo.png";
            const options = { data, image: logoUrl };

            qrCodeInstance.update(options);

            qrCodeContainer.innerHTML = "";
            qrCodeContainer.classList.add("has-code");
            qrCodeInstance.append(qrCodeContainer);
            downloadBtn.style.display = "flex";
        } catch (err) {
            console.error(err);
            throw new Error("Không thể tạo mã QR. Dữ liệu có thể quá lớn.");
        }
    }

    generateBtn.addEventListener("click", generateQRCode);

    downloadBtn.addEventListener("click", () => {
        if (qrCodeInstance) {
            qrCodeInstance.download({ name: "qr-code", extension: "png" });
        }
    });

    function setLoading(isLoading) {
        const icon = generateBtn.querySelector("svg");
        generateBtn.disabled = isLoading;

        if (isLoading) {
            generateBtn.classList.add("is-loading");
            if (icon) icon.style.display = "none";
            btnSpinner.style.display = "block";
            btnText.textContent = "Đang tạo mã...";
        } else {
            generateBtn.classList.remove("is-loading");
            if (icon) icon.style.display = "block";
            btnSpinner.style.display = "none";
            btnText.textContent = "Tạo mã QR";
        }
    }

    function showMessage(msg, type = "error") {
        messageArea.textContent = msg;
        messageArea.className = `message ${type}`;
        messageArea.style.display = "block";
    }

    function clearMessage() {
        messageArea.style.display = "none";
    }

    function resetOutput() {
        qrCodeContainer.innerHTML = placeholder;
        qrCodeContainer.classList.remove("has-code");
        downloadBtn.style.display = "none";
    }

    function clearInputsAndReset() {
        urlInput.value = "";
        fileInput.value = "";
        wifiSsidInput.value = "";
        wifiPasswordInput.value = "";
        wifiEncryptionSelect.value = "WPA";
        resetOutput();
        clearMessage();
    }

    togglePasswordBtn.addEventListener("click", function () {
        const isPassword =
            wifiPasswordInput.getAttribute("type") === "password";
        const eyeIcon = this.querySelector(".eye-icon");
        const eyeOffIcon = this.querySelector(".eye-off-icon");

        if (isPassword) {
            wifiPasswordInput.setAttribute("type", "text");
            eyeIcon.style.display = "none";
            eyeOffIcon.style.display = "block";
            this.setAttribute("aria-label", "Hide password");
        } else {
            wifiPasswordInput.setAttribute("type", "password");
            eyeIcon.style.display = "block";
            eyeOffIcon.style.display = "none";
            this.setAttribute("aria-label", "Show password");
        }
    });
});
