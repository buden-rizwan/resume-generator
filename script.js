let uploadedPhoto = null;

document.getElementById("photo").addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      uploadedPhoto = e.target.result;
    };

    reader.readAsDataURL(file);
  }
});

function autoCorrect(text) {
  let corrections = {
    teh: "the",
    recieve: "receive",
    adress: "address",
    experiance: "experience",
  };

  for (let wrong in corrections) {
    let regex = new RegExp("\\b" + wrong + "\\b", "gi");
    text = text.replace(regex, corrections[wrong]);
  }

  return text;
}

function formatBullets(text) {
  let lines = text.split("\n");
  let bullets = "<ul>";

  lines.forEach((line) => {
    if (line.trim() != "") {
      bullets += "<li>" + line.trim() + "</li>";
    }
  });

  bullets += "</ul>";

  return bullets;
}

function generateResume() {
  let template = document.getElementById("template").value;

  let first = document.getElementById("firstName").value;
  let last = document.getElementById("lastName").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("email").value;
  let skills = document.getElementById("skills").value;

  let experience = autoCorrect(document.getElementById("experience").value);
  let education = autoCorrect(document.getElementById("education").value);

  let bulletExperience = formatBullets(experience);

  let preview = document.getElementById("preview");

  preview.className = "preview template-" + template;

  let photoHTML = uploadedPhoto
    ? `<img src="${uploadedPhoto}" class="profile-photo">`
    : "";

  preview.innerHTML = `

${photoHTML}

<h2>${first} ${last}</h2>
<p><strong>Phone:</strong> ${phone} | <strong>Email:</strong> ${email}</p>

<h3>Skills</h3>
<p>${skills}</p>

<h3>Experience</h3>
${bulletExperience}

${education ? `<h3>Education</h3><p>${education}</p>` : ""}

`;
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;

  let doc = new jsPDF();

  let y = 10;

  if (uploadedPhoto) {
    doc.addImage(uploadedPhoto, "JPEG", 150, 10, 40, 40);
  }

  let text = document.getElementById("preview").innerText;

  let lines = doc.splitTextToSize(text, 130);

  doc.text(lines, 10, y);

  doc.save("resume.pdf");
}
