const { jsPDF } = require("jspdf");
const nodemailer = require("nodemailer");
const fs = require("fs");
let doc;
let margins = {
  top: 15,
  left: 15,
  right: 20,
  bottom: 15,
};
const width = 215.9;
const height = 279.4;

let baseColor = "black";
let baseFontSize = 10;
let subtitleFontSize = baseFontSize;
let mainTitleSize = 14;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "grupoavant.tablet@gmail.com",
    pass: "mftyrvghgoreuzfp",
  },
});

function generateReport(data, configParams) {
  //-------Layout--------
  let headerTop = 10;
  let top = 40;
  let left = 10;
  let right = left + 140;
  let granTotalRight = 460;
  let rightTotal = right;
  let center = 80;
  let itemsPerPage = 47;

  //-------File settings---------
  let fileNameDate = new Date().toISOString().split("T")[0];
  let fileName = `${configParams?.filename || "test"}-${fileNameDate}.pdf`;

  doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [width, height],
  });

  let tempData = [
    {
      Name: "Jose Miguel",
      Age: 33,
      "Additional Info": "Additional Info1",
      user: "j.miguel@test.com",
      zoiper: "3344",
    },
    {
      Name: "Juan Perex",
      Age: 33,
      "Additional Info": "fdafdsffjksj",
      user: "j.perexsadfsdfsd@test.com",
      zoiper: "3344",
    },
    {
      Name: "Carlos Vermillion",
      Age: 33,
      "Additional Info": "fdafdsffjksj",
      user: "iamthelargestemailinthistest@test.com",
      zoiper: "3344",
    },
    {
      Name: "Jose Miguel",
      Age: 33,
      "Additional Info": "Additional Info1",
      user: "j.miguel@test.com",
      zoiper: "3344",
    },
    {
      Name: "Juan Perex",
      Age: 33,
      "Additional Info": "fdafdsffjksj",
      user: "j.perexsadfsdfsd@test.com",
      zoiper: "3344",
    },
    {
      Name: "Carlos Vermillion",
      Age: 33,
      "Additional Info": "fdafdsffjksj",
      user: "iamthelargestemailinthistest@test.com",
      zoiper: "3344",
    },
    {
      Name: "Jose Miguel",
      Age: 33,
      "Additional Info": "Additional Info1",
      user: "j.miguel@test.com",
      zoiper: "3344",
    },
    {
      Name: "Juan Perex",
      Age: 33,
      "Additional Info": "fdafdsffjksj",
      user: "j.perexsadfsdfsd@test.com",
      zoiper: "3344",
    },
    {
      Name: "Carlos Vermillion",
      Age: 33,
      "Additional Info": "fdafdsffjksj",
      user: "iamthelargestemailinthistest@test.com",
      zoiper: "3344",
    },
  ];

  renderHeader(configParams);
  generateReportBody(data, configParams);

  doc.save(`${__dirname}/${fileName}`);

  let mailOptions = {
    from: "GaRecordfy <grupoavant.tablet@gmail.com",
    // from: "graceinternationalexchange@gmail.com",
    to: [
      "h.acosta@grupoavant.com.do",
      "gf.cavagliano@grupoavant.com.do",
      "l.feliz@grupoavant.com.do",
    ],
    attachments: [
      {
        filename:
          `${configParams.mailFilename}.pdf` || `Documento-sin-nombre.pdf`,
        path: `${__dirname}/${fileName}`,
      },
    ],
    subject: configParams.mailFilename.split("-").join(" "),
    text: `Adjunto archivo en pdf`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      //res.send({ sent: false });
    } else {
      console.log("Emal sent: ", info);
      //res.send({ sent: true });
    }
  });

  setTimeout(() => {
    fs.unlink(`${__dirname}/${fileName}`, (err) => {
      if (err) {
        throw err;
      }

      console.log("File deleted!");
    });
  }, 2000);
}

function renderHeader(params) {
  createMainTitle("GRUPO AVANT", margins.left, margins.top + 1);
  createMainSubtitle(params.description, margins.left, margins.top + 6);
  createText(
    "*Para hacer cambios en este reporte, favor comunicarse con el departamento de TI*",
    margins.left,
    width - margins.bottom,
    { fs: 8 }
  );
}

function generateReportBody(data, config) {
  renderTable(data);
}

function renderTable(data) {
  let columnNames = Object.keys(data[0]);
  let spaceFactor = 1.7;
  let yPos = margins.top + 20;

  //console.log(data);

  //Render Header
  let currentDistance = margins.left;
  let columnSpaces = [];
  columnNames.forEach((columnName, index) => {
    let maxColumnWidth = String(
      [...data].sort(
        (a, b) => b[columnName]?.length - a[columnName]?.length
      )[0][columnName]
    ).length;

    // console.log("WE ARE TRYING ", columnName, maxColumnWidth);
    columnSpaces.push(currentDistance);
    if (!columnName.includes("_id")) {
      let displayName =
        columnName.split(" ").length > 1
          ? `${columnName.split(" ")[0]}\n${columnName.split(" ")[1]}`
          : columnName;
      //console.log(displayName);
      createSubTitle(displayName, currentDistance, yPos, {});
      // if (index === 0) {
      //   currentDistance = margins.left;
      // } else {
      //   if (maxColumnWidth * spaceFactor < 20) {
      //     currentDistance += 20;
      //   } else {
      currentDistance += 15 + maxColumnWidth * spaceFactor;
      //}
      //}
    }
  });

  //   currentDistance = margins.left;

  //Render Body
  yPos += 10;

  for (obj of data) {
    Object.entries(obj).forEach(([key, value], index) => {
      let name = "";
      switch (value) {
        case true:
          name = "SI";
          break;
        case false:
          name = "NO";
          break;
        case null:
          name = "-";
          break;
        default:
          name = value;
          break;
      }

      if (key === "Beneficiario" || key === "Tipo Ident.") {
        name = formatName(name);
      }

      //console.log(`${name}`, columnSpaces[index], yPos);
      if (!key.includes("_id")) {
        key === "No. Record"
          ? doc.textWithLink(`${name}`, columnSpaces[index], yPos, {
              url: `http://localhost:3000/records/${obj.record_id}`,
            })
          : createText(`${name}`, columnSpaces[index], yPos);
      }
    });
    yPos += 5;
  }
}

function createMainTitle(text, left, top, props) {
  let color = baseColor;
  doc.setFontSize(mainTitleSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}
function createMainSubtitle(text, left, top, props) {
  let color = baseColor;
  doc.setFontSize(mainTitleSize - 1);
  doc.setFont("helvetica", "normal", "normal");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

function createSubTitle(text, left, top, props) {
  let color = baseColor;

  doc.setFontSize(subtitleFontSize);
  doc.setFont("helvetica", "normal", "bold");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
  doc.setTextColor(baseColor);
  doc.setFontSize(baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
}

function createText(text, left, top, props) {
  let color = baseColor;

  doc.setFontSize(props?.fs || baseFontSize);
  doc.setFont("helvetica", "normal", "normal");
  doc.setTextColor(color);
  doc.text(text, left, top, { ...props });
}

function formatName(name) {
  return name
    .split(" ")
    .map(
      (item) => `${item}`[0].toUpperCase() + `${item}`.slice(1).toLowerCase()
    )
    .join(" ");
}

module.exports = {
  generateReport,
};

//l.feliz@grupoavant.com.do
