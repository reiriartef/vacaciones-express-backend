const ReportesService = require("../services/reportes.service");
const fs = require("fs");

class ReportesController {
  async generarReporteAprobacionVacaciones(req, res) {
    const { id } = req.params;
    const reportesService = new ReportesService();

    try {
      const filePath = await reportesService.generarReporteAprobacionVacaciones(
        id
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=aprobacion_vacaciones_${id}.pdf`
      );

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on("finish", () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo:", err);
          }
        });
      });

      fileStream.on("error", (err) => {
        console.error("Error al leer el archivo:", err);
        res.status(500).send("Error al descargar el archivo");
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ReportesController;
