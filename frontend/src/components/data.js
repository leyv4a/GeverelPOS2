// Data for users table
export const userColumns = [
    { uid: 'name', name: 'Name', sortable: true },
    { uid: 'role', name: 'Role', sortable: true },
    { uid: 'actions', name: 'Actions', sortable: false }
];

export const users = [
    { id: 1, name: 'John Doe', role: 'Admin', avatar: 'url', email: 'john@example.com' },
    // more user data...
];

// Data for products table
export const productColumns = [
    { uid: 'name', name: 'Nombre', sortable: true },
    { uid: 'precio', name: 'Precio', sortable: true },
    { uid: 'categoria', name: 'Categoria', sortable: true },
    { uid: 'acciones', name: 'Actions', sortable: false }
];

export const products = [
    { id: 1, name: 'Product 1', precio: '$10', categoria: 'Category 1' },
    { id: 2, name: 'Product 2', precio: '$15', categoria: 'Category 2' },
    { id: 3, name: 'Product 3', precio: '$20', categoria: 'Category 3' },
    { id: 4, name: 'Product 4', precio: '$25', categoria: 'Category 4' },
    { id: 5, name: 'Product 5', precio: '$30', categoria: 'Category 5' }
    // more product data...
];
