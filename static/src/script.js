function detectDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
    return "mobile";
  } else {
    return "desktop";
  }
}

function toggleForm() {
  const userType = document.getElementById("user-type").value;
  const facultyForm = document.getElementById("faculty-form");
  const studentForm = document.getElementById("student-form");
  const formContainer = document.getElementById("form-container");

  if (userType === "faculty") {
    facultyForm.style.display = "block";
    studentForm.style.display = "none";
    formContainer.classList.add("w-[50vw]");
  } else if (userType === "student") {
    facultyForm.style.display = "none";
    studentForm.style.display = "block";
    formContainer.classList.add("w-[70vw]");
  }
}

window.onload = function () {
  const deviceType = detectDeviceType();
  const userTypeSelect = document.getElementById("user-type");
  const startQrScanButton = document.getElementById("start-qr-scan");
  const qrReaderContainer = document.getElementById("qr-reader");

  if (deviceType === "mobile") {
    userTypeSelect.value = "student";
  } else {
    userTypeSelect.value = "faculty";
  }
  toggleForm();

  userTypeSelect.addEventListener("change", toggleForm);

  function onScanSuccess() {
    // Assuming 'roll_number' and 'student_name' are the IDs for the input fields
    const rollNumber = document.getElementById("roll-number").value;
    const studentName = document.getElementById("student-name").value;

    // Construct the URL with query parameters
    const url = new URL("/scan_qr", window.location.origin);
    url.searchParams.append("roll_number", rollNumber);
    url.searchParams.append("student_name", studentName);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Assuming there's an element with the ID 'attendance-list' to display the attendance
          const attendanceList = document.getElementById("attendance-list");
          attendanceList.innerHTML = "";
          data.forEach((item) => {
            const row = `<tr>
              <td>${item.subject}</td>
              <td>${item.attendance}</td>
              </tr>`;
            attendanceList.insertAdjacentHTML("beforeend", row);
          });
          alert("Attendance recorded successfully.");
        } else {
          // Handle the case where the scan was not successful
          alert("Scan was not successful. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while scanning. Please try again.");
      });

    // Redirect to the URL or make a fetch request
    // // Redirect example:
    // window.location.href = url.href;
  }

  startQrScanButton.addEventListener("click", function () {
    qrReaderContainer.style.display = "block";
    startQrScanButton.style.display = "none";
    startQrScan();
  });

  function startQrScan(facingMode = "environment") {
    const qrScanner = new Html5Qrcode("qr-reader");
    qrScanner.start(
      { facingMode: facingMode },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      onScanSuccess
    );
  }
};
