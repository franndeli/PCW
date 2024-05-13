# Proyecto Cliente Web Interactivo

Este repositorio contiene los archivos de la segunda práctica de la asignatura de Programación del Cliente Web, desarrollada durante el curso académico 2022-2023 en el Grado en Ingeniería Multimedia. El objetivo principal de esta práctica es aplicar técnicas avanzadas de JavaScript en el lado del cliente para añadir dinamismo e interacción en un sitio web, utilizando AJAX y la API Fetch para comunicarse con un servidor RESTful sin necesidad de recargar la página.

## Tecnologías Utilizadas

- **JavaScript**: Para toda la lógica del cliente.
- **AJAX/Fetch API**: Para realizar peticiones asíncronas al servidor.
- **PHP**: Usado en el backend para manejar las solicitudes del cliente.
- **MySQL**: Para la gestión de la base de datos.
- **XAMPP**: Como servidor local para desarrollar y probar la aplicación.

## Instalación y Configuración

Para ejecutar este proyecto localmente, necesitas instalar XAMPP y seguir los siguientes pasos:

1. Clona este repositorio en tu directorio `htdocs` de XAMPP.
2. Inicia los módulos Apache y MySQL desde el panel de control de XAMPP.
3. Importa el archivo `script.sql` proporcionado en el directorio del proyecto a través de phpMyAdmin para configurar la base de datos.
4. Asegúrate de configurar los permisos adecuados en las carpetas si estás usando Linux/Mac:

```
chmod 777 -R /path_to_xampp/htdocs/pcw/practica2
```


## Uso

Una vez instalado y configurado, puedes acceder al proyecto a través de la URL `http://localhost/pcw/practica2` en tu navegador.

## Problemas Conocidos y Limitaciones

- El proyecto necesita correr en un entorno local con XAMPP debido a las configuraciones específicas del servidor Apache y las bases de datos MySQL.
- No se incluyen tests automatizados para las funcionalidades JavaScript.

## Contribuciones

Las contribuciones son bienvenidas. Si tienes alguna sugerencia para mejorar este proyecto, por favor, abre un issue o envía un pull request.

## Contacto

Si tienes preguntas o necesitas más información, puedes contactarme a través de [delicadofranvi@gmail.com](mailto:delicadofranvi@gmail.com).

