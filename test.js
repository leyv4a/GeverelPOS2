const getMasVendido= (callback)=>{
    try {
        const query = "SELECT substr(fecha, instr(fecha, '/')+1, 7) AS Mes, P.nombre AS Producto, SUM(T.cantidad) AS TotalVendidoMes FROM transacciones T JOIN productos P ON T.producto_id = P.id WHERE T.motivo = 'Venta' GROUP BY Mes, P.id ORDER BY TotalVendidoMes DESC LIMIT 1;"
        db.all(query, [], function (err, rows) {
            if (err) {
                callback({ message: err.message }, null);
            } else {
                callback(null, rows);
            }});

    } catch (error) {
        callback({ message: error.message }, null);
    }
   } 

   const getTopCinco= (callback)=>{
    try {
        const query = "SELECT substr(fecha, instr(fecha, '/')+1, 7) AS Mes, P.nombre AS Producto, SUM(T.cantidad) AS TotalVendidoMes FROM transacciones T JOIN productos P ON T.producto_id = P.id WHERE T.motivo = 'Venta' GROUP BY Mes, P.id ORDER BY TotalVendidoMes DESC LIMIT 5;"
        db.all(query, [], function (err, rows) {
            if (err) {
                callback({ message: err.message }, null);
            } else {
                callback(null, rows);
            }});

    } catch (error) {
        callback({ message: error.message }, null);
    }
   } 
   
   const gananciasBrutas = (callback)=>{
    const query = "SELECT strftime('%Y-%m', fecha) AS Mes, SUM(monto) AS brutas FROM ventas GROUP BY Mes"
    db.all(query, [], callback);

}

const getVentasDiarias = (callback) => {
    const query = "SELECT strftime('%d', fecha) AS dia, COUNT(*) AS ventas FROM ventas WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now') GROUP BY dia;"
    
    db.all(query, [], callback);
  };

  const getVentaSemanaMes = (callback) => {
    //Esta consulta devuelve el dineor generado ese dia
    // const query = "SELECT strftime('%w', fecha) as dia_semana, strftime('%Y-%m', fecha) as mes_anio, SUM(monto) as total_ventas FROM ventas WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now') GROUP BY dia_semana ORDER BY dia_semana;" 
    const query = "SELECT strftime('%w', fecha) as dia_semana, COUNT(*) as total_ventas FROM ventas WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now') GROUP BY dia_semana ORDER BY dia_semana;"
    db.all(query, [], callback);
  }

const gastosMes =  (callback) => {
    // const query = "SELECT Mes, GananciasBrutas, GastosTotales, (GananciasBrutas - GastosTotales) AS GananciasNetas FROM ( SELECT strftime('%Y-%m', fecha) AS Mes, SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END) AS GananciasBrutas, SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END) AS GastosTotales FROM ganancias WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now') GROUP BY Mes);"
    const query = "SELECT Mes, GastosTotales, GananciasBrutas, (GananciasBrutas - GastosTotales) AS GananciasNetas, (GananciasNetas / GananciasBrutas * 100) AS Margen FROM (SELECT strftime('%Y-%m', fecha) AS Mes, SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END) AS GananciasBrutas, SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END) AS GastosTotales, SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE -monto END) AS GananciasNetas FROM ganancias WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now')GROUP BY Mes);"
    db.all(query, [], callback);
}
