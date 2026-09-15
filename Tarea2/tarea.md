5 APIs de Tarea — Arquitectura por capas
Basarse en la estructura y patrones del repositorio tareas-prisma visto en clase.

API 1 — Carrito de Compras
Modelo: { id, nombre, precio, cantidad }

GET	/productos	Listar productos
POST	/productos	Agregar producto
PUT	/productos/:id	Actualizar cantidad
DELETE	/productos/:id	Eliminar producto
GET	/carrito/total	Calcular total (precio × cantidad)
POST	/carrito/aplicar-descuento	Recibe { porcentaje } y devuelve total con descuento
Reglas de negocio:

precio y cantidad deben ser números positivos
No se puede agregar el mismo producto dos veces — si ya existe, suma la cantidad
Descuento máximo permitido: 50%
API 2 — Sistema de Votación
Modelos: { id, pregunta, opciones: [] } y votos por opción

POST	/encuestas	Crear encuesta con opciones
GET	/encuestas	Listar encuestas
POST	/encuestas/:id/votar	Recibe { opcion } y registra voto
GET	/encuestas/:id/resultados	Devuelve votos por opción y ganador
DELETE	/encuestas/:id	Eliminar encuesta
Reglas de negocio:

Mínimo 2 opciones al crear
No se puede votar por una opción que no existe en la encuesta
Los resultados deben incluir porcentaje por opción y cuál va ganando
API 3 — Control de Inventario
Modelo: { id, producto, stock, stockMinimo }

GET	/inventario	Listar todo
POST	/inventario	Crear producto
POST	/inventario/:id/entrada	Recibe { cantidad } y suma al stock
POST	/inventario/:id/salida	Recibe { cantidad } y resta del stock
GET	/inventario/alertas	Lista productos bajo stockMinimo
Reglas de negocio:

No se puede hacer una salida si cantidad > stock disponible
stockMinimo por defecto es 5 si no se envía
/alertas debe indicar cuánto falta para llegar al mínimo
API 4 — Gestor de Turnos
Modelo: { id, cliente, servicio, estado } — estado: esperando | atendiendo | finalizado

POST	/turnos	Crear turno (entra en cola)
GET	/turnos	Ver todos los turnos
GET	/turnos/siguiente	Ver quién es el próximo
PUT	/turnos/llamar	Llama al siguiente — cambia estado a atendiendo
PUT	/turnos/:id/finalizar	Marca turno como finalizado
GET	/turnos/espera	Cuántos están esperando
Reglas de negocio:

Solo puede haber un turno en estado atendiendo a la vez
No se puede llamar al siguiente si hay uno siendo atendido
El orden es estricto FIFO — primero en entrar, primero en ser llamado
API 5 — Rastreador de Hábitos
Modelo: { id, nombre, meta, registros: [] } — cada registro: { fecha, completado }

POST	/habitos	Crear hábito con meta diaria
GET	/habitos	Listar hábitos
POST	/habitos/:id/registrar	Marcar hábito del día como completado
GET	/habitos/:id/estadisticas	Racha actual, mejor racha, % cumplimiento
DELETE	/habitos/:id	Eliminar hábito
Reglas de negocio:

No se puede registrar el mismo hábito dos veces en el mismo día
Las estadísticas deben calcular racha actual, mejor racha histórica y porcentaje de días cumplidos
La fecha del registro la pone el servidor, no el cliente
Entrega para todas
Seguir la estructura y patrones del repositorio visto en clase
src/index.js solo con configuración de Express, middlewares globales y app.listen
Middleware de logging en src/middlewares/
Middleware de validación por ruta en src/middlewares/
Probar todos los endpoints con Thunder Client con capturas de pantalla