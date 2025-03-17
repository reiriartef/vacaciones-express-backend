const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");
const Vacaciones = require("../models/vacaciones.model");
const Funcionario = require("../models/funcionario.model");
const Dependencia = require("../models/dependencia.model");
const Cargo = require("../models/cargo.model");
const TipoEmpleado = require("../models/tipoEmpleado.model");
const Usuario = require("../models/usuario.model");

class ReportesService {
  async generarReporteAprobacionVacaciones(id) {
    try {
      const vacacion = await Vacaciones.findByPk(id, {
        include: [
          {
            model: Funcionario,
            as: "funcionarioDetails",
            attributes: [
              "cedula",
              "primer_nombre",
              "segundo_nombre",
              "primer_apellido",
              "segundo_apellido",
              "fecha_ingreso",
              "fecha_prima",
            ],
            include: [
              {
                model: Dependencia,
                as: "dependencia",
                attributes: ["nombre"],
              },
              {
                model: Cargo,
                as: "cargo",
                attributes: ["nombre"],
                include: [
                  {
                    model: TipoEmpleado,
                    as: "tipoEmpleado",
                    attributes: ["descripcion"],
                  },
                ],
              },
            ],
          },
          {
            model: Usuario,
            as: "usuarioAprobador",
            attributes: ["nombre_usuario"],
            include: [
              {
                model: Funcionario,
                as: "funcionarioDetails",
                attributes: [
                  "cedula",
                  "primer_nombre",
                  "segundo_nombre",
                  "primer_apellido",
                  "segundo_apellido",
                ],
              },
            ],
          },
        ],
      });

      if (!vacacion) {
        throw new Error("Vacación no encontrada");
      }

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "legal",
      });

      // Márgenes de referencia
      const marginLeft = 15;
      let currentY = 20;

      // === Encabezado ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("REPUBLICA BOLIVARIANA DE VENEZUELA", marginLeft, currentY);
      currentY += 6;
      doc.text("TRIBUNAL SUPREMO DE JUSTICIA", marginLeft, currentY);
      currentY += 6;
      doc.text("DIRECCIÓN EJECUTIVA DE LA MAGISTRATURA", marginLeft, currentY);
      currentY += 6;
      doc.text("DIRECCIÓN ADMINISTRATIVA REGIONAL", marginLeft, currentY);
      currentY += 6;
      doc.text("DIVISIÓN DE SERVICIOS AL PERSONAL", marginLeft, currentY);

      currentY += 12;

      // === Título Principal ===
      doc.setFontSize(14);
      doc.setFont("helvetica", "bolditalic");
      doc.text("APROBACIÓN DE VACACIONES", 108, currentY, { align: "center" });

      currentY += 15;

      // === Nº y Fecha de Emisión ===
      doc.setFontSize(10);
      doc.setFont("helvetica", "bolditalic");
      doc.text(`Nº ${id}`, marginLeft, currentY);
      const fechaEmision = new Date().toLocaleDateString();
      doc.text(`FECHA DE EMISIÓN: ${fechaEmision}`, 130, currentY);

      currentY += 5;
      doc.line(marginLeft, currentY, 200, currentY);

      currentY += 10;

      // === DATOS DEL TITULAR ===
      doc.setFontSize(12);
      doc.setFont("helvetica", "bolditalic");
      doc.setFillColor(224, 224, 224); // Gris claro
      doc.rect(marginLeft, currentY, 180, 8, "F");
      doc.setTextColor(0); // Negro
      doc.text("DATOS DEL TITULAR", 108, currentY + 6, { align: "center" });

      currentY += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bolditalic");
      doc.text("APELLIDOS:", marginLeft, currentY);
      doc.text("NOMBRES:", 90, currentY);
      doc.text("CÉDULA:", 160, currentY);

      currentY += 5;
      doc.line(marginLeft, currentY, 200, currentY);

      currentY += 10;

      const funcionario = vacacion.funcionarioDetails;
      doc.text(
        `${funcionario.primer_apellido} ${funcionario.segundo_apellido}`,
        marginLeft,
        currentY
      );
      doc.text(
        `${funcionario.primer_nombre} ${funcionario.segundo_nombre}`,
        90,
        currentY
      );
      doc.text(`${funcionario.cedula}`, 160, currentY);

      currentY += 5;
      doc.line(marginLeft, currentY, 200, currentY);

      currentY += 10;

      doc.text("UBICACIÓN:", marginLeft, currentY);
      doc.text(`${funcionario.dependencia.nombre}`, marginLeft + 30, currentY);
      currentY += 5;
      doc.line(marginLeft, currentY, 200, currentY);

      currentY += 10;

      doc.text("CARGO:", marginLeft, currentY);
      doc.text("FECHA DE INGRESO:", 90, currentY);
      doc.text("FECHA DE PRIMA:", 160, currentY);

      currentY += 5;
      doc.line(marginLeft, currentY, 200, currentY);

      currentY += 10;

      doc.text(`${funcionario.cargo.nombre}`, marginLeft, currentY);
      doc.text(`${funcionario.fecha_ingreso}`, 90, currentY);
      doc.text(`${funcionario.fecha_prima}`, 160, currentY);

      currentY += 10;

      // === OBSERVACIONES ===
      doc.text("OBSERVACIONES:", marginLeft, currentY);
      doc.text(`${vacacion.observaciones || "N/A"}`, marginLeft, currentY + 5);

      currentY += 15;

      // === PERÍODOS A DISFRUTAR ===
      doc.setFillColor(224, 224, 224); // Gris claro
      doc.rect(marginLeft, currentY, 180, 8, "F");
      doc.setFontSize(12);
      doc.text("PERÍODOS A DISFRUTAR", 108, currentY + 6, { align: "center" });

      currentY += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bolditalic");
      doc.text("PERIODO(S):", marginLeft, currentY);
      doc.text("QUINQUENIO(S):", 90, currentY);
      doc.text("Nº DE DÍAS:", 160, currentY);

      currentY += 5;
      doc.line(marginLeft, currentY, 200, currentY);

      currentY += 10;

      // Llenar los datos de períodos, quinquenios y días
      const diasDisfrutar = vacacion.dias_disfrutar;
      let quinquenios;
      if (funcionario.cargo.tipoEmpleado.descripcion === "Empleado") {
        if (diasDisfrutar === 20) quinquenios = 1;
        else if (diasDisfrutar === 23) quinquenios = 2;
        else if (diasDisfrutar === 25) quinquenios = 3;
        else if (diasDisfrutar === 27) quinquenios = 4;
        else if (diasDisfrutar === 30) quinquenios = 5;
      } else if (funcionario.cargo.tipoEmpleado.descripcion === "Obrero") {
        if (diasDisfrutar === 20) quinquenios = 1;
        else if (diasDisfrutar === 25) quinquenios = 2;
        else if (diasDisfrutar === 30) quinquenios = 3;
      }

      doc.text(`${vacacion.año}`, marginLeft, currentY);
      doc.text(`${quinquenios}`, 90, currentY);
      doc.text(`${diasDisfrutar}`, 160, currentY);

      currentY += 15;

      // === PERÍODO VACACIONAL ===
      doc.setFillColor(224, 224, 224); // Gris claro
      doc.rect(marginLeft, currentY, 180, 8, "F");
      doc.setFontSize(12);
      doc.text("PERÍODO VACACIONAL", 108, currentY + 6, { align: "center" });

      currentY += 15;

      doc.setFontSize(10);
      doc.text("FECHA DE INICIO:", marginLeft, currentY);
      doc.text("FECHA DE CULMINACIÓN:", 90, currentY);
      doc.text("FECHA DE REINTEGRO:", 160, currentY);

      currentY += 5;
      doc.line(marginLeft, currentY, 200, currentY);

      currentY += 10;

      doc.text(`${vacacion.fecha_salida}`, marginLeft, currentY);
      doc.text(`${vacacion.fecha_finalizacion}`, 90, currentY);
      doc.text(`${vacacion.fecha_reincorporacion}`, 160, currentY);

      currentY += 15;

      // === FIRMAS ===
      const firmaBoxHeight = 10;
      const firmaBoxWidth = 50;

      doc.setFontSize(8);
      doc.setFillColor(224, 224, 224); // Gris claro
      doc.rect(marginLeft, currentY, firmaBoxWidth, firmaBoxHeight, "F");
      doc.text("CALCULADO POR:", marginLeft + 5, currentY + 4);
      doc.text(
        `${vacacion.usuarioAprobador.funcionarioDetails.primer_nombre} ${vacacion.usuarioAprobador.funcionarioDetails.primer_apellido}`,
        marginLeft + 5,
        currentY + 9
      );
      doc.setFillColor(224, 224, 224); // Gris claro

      doc.rect(
        marginLeft + firmaBoxWidth + 10,
        currentY,
        firmaBoxWidth + 10,
        firmaBoxHeight,
        "F"
      );

      doc.text(
        "CONFORMADO POR:",
        marginLeft + firmaBoxWidth + 15,
        currentY + 4
      );
      doc.text(
        "JEFE DE SERVICIOS AL PERSONAL",
        marginLeft + firmaBoxWidth + 15,
        currentY + 9
      );
      doc.setFillColor(224, 224, 224); // Gris claro

      doc.rect(
        marginLeft + firmaBoxWidth * 2 + 30,
        currentY,
        firmaBoxWidth,
        firmaBoxHeight,
        "F"
      );
      doc.text(
        "AUTORIZADO POR:",
        marginLeft + firmaBoxWidth * 2 + 35,
        currentY + 4
      );
      doc.text(
        "DIRECTOR ADMIN. REGIONAL",
        marginLeft + firmaBoxWidth * 2 + 35,
        currentY + 9
      );

      currentY += 15;

      // Líneas para firmas
      doc.line(marginLeft, currentY, marginLeft + firmaBoxWidth, currentY);
      doc.line(
        marginLeft + firmaBoxWidth + 10,
        currentY,
        marginLeft + firmaBoxWidth * 2 + 10,
        currentY
      );
      doc.line(
        marginLeft + firmaBoxWidth * 2 + 30,
        currentY,
        marginLeft + firmaBoxWidth * 3 + 30,
        currentY
      );

      currentY += 15;

      // === OBSERVACIONES FINALES ===
      doc.setFontSize(8);
      doc.text(
        "OBSERVACIÓN: AL EXISTIR UN DÍA NO LABORABLE DECRETADO POR NIVEL CENTRAL, ESTE CORRERÁ EL PERÍODO VACACIONAL AUTOMÁTICAMENTE.",
        marginLeft,
        currentY,
        { maxWidth: 180 }
      );
      currentY += 10;

      currentY += 10;

      const fechaElaboracion = new Date().toLocaleDateString();
      const horaElaboracion = new Date().toLocaleTimeString();
      doc.setFontSize(10);
      doc.text(
        `FECHA DE ELABORACIÓN: ${fechaElaboracion}`,
        marginLeft,
        currentY
      );
      doc.text(`HORA DE ELABORACIÓN: ${horaElaboracion}`, 120, currentY);

      // Guardar el PDF en el sistema de archivos
      const filePath = path.join(__dirname, `aprobacion_vacaciones_${id}.pdf`);
      doc.save(filePath);

      return filePath;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ReportesService;
