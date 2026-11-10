# MANILA

Plataforma web de restaurante desarrollada con Angular 17, TypeScript y Bootstrap.

## Funcionalidades

- **Inicio:** carrusel del restaurante y platos/bebidas destacados de TheMealDB y TheCocktailDB.
- **Comidas:** catálogo organizado por categorías, búsqueda por nombre o ingrediente y precios aleatorios en COP.
- **Bebidas:** catálogo con búsqueda por nombre o ingrediente y filtros por tipo (alcohólica/sin alcohol) y categoría (cóctel/bebida ordinaria).
- **Pedido:** carrito con cantidades, datos del cliente y comprobante en pantalla con fecha y logo.
- **Juego:** tablero de memoria de 4 × 4 que esconde un plato y una bebida.

Las API proporcionan los datos e imágenes de los productos mediante `fetch` y promesas. El carrito se conserva en `localStorage` y se comparte en la aplicación con una señal de Angular. Los precios se asignan aleatoriamente al producto y se mantienen iguales durante la sesión para que búsquedas repetidas no cambien el valor del pedido.

## Ejecución

Instala dependencias y levanta el servidor de desarrollo:

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200/`.

## Validación

```bash
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

Las pruebas requieren un navegador Chrome/Chromium disponible para Karma.
