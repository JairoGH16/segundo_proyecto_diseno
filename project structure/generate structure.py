import os

def create_project_structure(base_path):
    """
    Genera la estructura de carpetas y archivos para el proyecto finance-api.
    """
    project_name = "finance-api"
    project_path = os.path.join(base_path, project_name)

    # Definir la estructura de archivos y carpetas
    structure = {
        "src": {
            "config": ["database.ts", "swagger.ts"],
            "controllers": [
                "auth.controller.ts",
                "account.controller.ts",
                "transaction.controller.ts",
                "budget.controller.ts",
                "debt.controller.ts",
                "guarantee.controller.ts",
            ],
            "services": [
                "auth.service.ts",
                "account.service.ts",
                "transaction.service.ts",
            ],
            "repositories": [
                "user.repository.ts",
                "account.repository.ts",
                "transaction.repository.ts",
            ],
            "middleware": ["auth.middleware.ts", "errorHandler.middleware.ts"],
            "routes": [
                "auth.routes.ts",
                "account.routes.ts",
                "transaction.routes.ts",
                "budget.routes.ts",
                "debt.routes.ts",
                "guarantee.routes.ts",
            ],
            "models": ["types.ts"],
            "utils": ["jwt.util.ts", "validation.util.ts"],
            "app.ts": None,  # None indica que es un archivo y no una carpeta
        },
        "prisma": {"schema.prisma": None},
        ".env.example": None,
        ".gitignore": None,
        "package.json": None,
        "tsconfig.json": None,
        "README.md": None,
    }

    print(f"Creando estructura del proyecto en: {os.path.abspath(project_path)}")
    os.makedirs(project_path, exist_ok=True)

    def create_items(current_path, current_structure):
        for name, content in current_structure.items():
            item_path = os.path.join(current_path, name)
            if isinstance(content, dict):  # Es una carpeta
                os.makedirs(item_path, exist_ok=True)
                print(f"Carpeta creada: {item_path}")
                create_items(item_path, content)
            elif isinstance(content, list):  # Es una lista de archivos
                os.makedirs(item_path, exist_ok=True)
                print(f"Carpeta creada: {item_path}")
                for file_name in content:
                    file_path = os.path.join(item_path, file_name)
                    with open(file_path, "w") as f:
                        pass  # Crea un archivo vacío
                    print(f"Archivo creado: {file_path}")
            else:  # Es un archivo individual
                with open(item_path, "w") as f:
                    pass  # Crea un archivo vacío
                print(f"Archivo creado: {item_path}")

    create_items(project_path, structure)
    print("\n¡Estructura del proyecto generada exitosamente!")


if __name__ == "__main__":
    # Puedes cambiar '.' por la ruta donde quieres que se cree la carpeta 'finance-api'
    create_project_structure(".")