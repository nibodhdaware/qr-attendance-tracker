function detectDeviceType()
{
	const userAgent = navigator.userAgent.toLowerCase();
	if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
		return 'mobile';
	} else {
		return 'desktop';
	}
}

function toggleForm()
{
	const userType = document.getElementById('user-type').value;
	const facultyForm = document.getElementById('faculty-form');
	const studentForm = document.getElementById('student-form');
	const formContainer = document.getElementById('form-container')

	if (userType === 'faculty') {
		facultyForm.style.display = 'block';
		studentForm.style.display = 'none';
		formContainer.classList.add('w-[50vw]')
	} else if (userType === 'student') {
		facultyForm.style.display = 'none';
		studentForm.style.display = 'block';
		formContainer.classList.add('w-[70vw]')
	}
}

window.onload = function ()
{
	const deviceType = detectDeviceType();
	const userTypeSelect = document.getElementById('user-type');
	if (deviceType === 'mobile') {
		userTypeSelect.value = 'student';
	} else {
		userTypeSelect.value = 'faculty';
	}
	toggleForm();

	userTypeSelect.addEventListener('change', toggleForm);
}