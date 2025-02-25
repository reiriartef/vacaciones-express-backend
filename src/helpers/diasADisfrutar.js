const esDiaHabil = (fecha) => {
  const dia = fecha.getDay();
  return dia >= 1 && dia <= 5; // Lunes a viernes
};

const esFeriado = (fecha, feriados) => {
  return feriados.some(
    (feriado) =>
      feriado.getDate() === fecha.getDate() &&
      feriado.getMonth() === fecha.getMonth() &&
      feriado.getFullYear() === fecha.getFullYear()
  );
};

const calcularDias = (tipo_empleado, fecha_ingreso, año) => {
  const fechaIngreso = new Date(fecha_ingreso);
  const fechaACalcular = new Date(
    año,
    fechaIngreso.getMonth(),
    fechaIngreso.getDate()
  );

  let añosDeServicio =
    fechaACalcular.getFullYear() - fechaIngreso.getFullYear();

  // Ajustar si la fecha de ingreso aún no ha pasado en el año específico
  if (fechaACalcular < fechaIngreso) {
    añosDeServicio--;
  }

  if (tipo_empleado != "Empleado") {
    if (añosDeServicio <= 5) {
      return 20;
    }

    if (añosDeServicio <= 10) {
      return 25;
    }

    return 30;
  }

  if (añosDeServicio <= 5) {
    return 20;
  }

  if (añosDeServicio <= 10) {
    return 23;
  }
  if (añosDeServicio <= 15) {
    return 25;
  }
  if (añosDeServicio <= 20) {
    return 27;
  }
  return 30;
};

const calcularFechaFinalizacion = (fecha_salida, diasVacaciones, feriados) => {
  let fechaFinalizacion = new Date(fecha_salida);
  let diasHabilesContados = 0;

  while (diasHabilesContados < diasVacaciones) {
    fechaFinalizacion.setDate(fechaFinalizacion.getDate() + 1);

    if (
      esDiaHabil(fechaFinalizacion) &&
      !esFeriado(fechaFinalizacion, feriados)
    ) {
      diasHabilesContados++;
    }
  }

  // Ajustar si la fecha de finalización cae en fin de semana o feriado
  while (
    !esDiaHabil(fechaFinalizacion) ||
    esFeriado(fechaFinalizacion, feriados)
  ) {
    fechaFinalizacion.setDate(fechaFinalizacion.getDate() + 1);
  }

  return fechaFinalizacion.toISOString().split("T")[0];
};

const calcularFechaReintegro = (fechaFinalizacion, feriados) => {
  let fechaReintegro = new Date(fechaFinalizacion);
  fechaReintegro.setDate(fechaReintegro.getDate() + 1);

  // Ajustar si la fecha de reintegro cae en fin de semana o feriado
  while (!esDiaHabil(fechaReintegro) || esFeriado(fechaReintegro, feriados)) {
    fechaReintegro.setDate(fechaReintegro.getDate() + 1);
  }

  return fechaReintegro.toISOString().split("T")[0];
};

const calcularFechaFinalizacionVacaciones = (
  diasHabiles,
  fechaInicio,
  diasFeriados
) => {
  const feriados = new Set(diasFeriados.map((d) => new Date(d).toDateString()));
  let diasContados = 0;
  let fechaFinal = new Date(fechaInicio);

  while (diasContados < diasHabiles) {
    fechaFinal.setDate(fechaFinal.getDate() + 1);
    const diaSemana = fechaFinal.getDay();
    const fechaStr = fechaFinal.toDateString();

    // Ignorar sábados, domingos y feriados
    if (diaSemana !== 6 && diaSemana !== 0 && !feriados.has(fechaStr)) {
      diasContados++;
    }
  }

  // Asegurarse de que la fecha final es un día hábil
  while (
    fechaFinal.getDay() === 6 ||
    fechaFinal.getDay() === 0 ||
    feriados.has(fechaFinal.toDateString())
  ) {
    fechaFinal.setDate(fechaFinal.getDate() + 1);
  }

  // Reducir 16 horas para obtener la fecha correcta
  fechaFinal.setHours(fechaFinal.getHours() - 16);

  // Buscar el siguiente día hábil
  let fechaReinicio = new Date(fechaFinal);
  do {
    fechaReinicio.setDate(fechaReinicio.getDate() + 1);
  } while (
    fechaReinicio.getDay() === 6 ||
    fechaReinicio.getDay() === 0 ||
    feriados.has(fechaReinicio.toDateString())
  );

  return {
    fechaFinalizacion: fechaFinal.toISOString().split("T")[0],
    fechaReinicio: fechaReinicio.toISOString().split("T")[0],
  };
};

module.exports = {
  calcularFechaFinalizacionVacaciones,
  calcularDias,
};
