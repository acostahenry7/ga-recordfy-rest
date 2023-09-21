module.exports = (params) => {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;500&display=swap"
      rel="stylesheet"
    />

    <style>
      * {
        font-family: "Nunito", sans-serif;
      }

      .container {
        background-color: #fafafa;
        color: #394867;
        border-radius: 12px;
        border-top: 10px solid #394867;
        /*border-bottom: 40px solid #f1f6f9;*/
        padding: 60px;
        box-shadow: 0 20px 100px rgba(0, 0, 0, 0.1);
      }

      h1 {
        margin: 0;
        font-size: 40px;
        font-weight: normal;
        margin-bottom: 40px;
      }

      span {
        font-weight: bold;
      }

      p {
        color: #7c8daf;
        margin-bottom: 30px;
        font-size: 16px !important;
      }

      a:last-child {
        text-decoration: none;
        color: #394867 !important;
        border: 1px solid #394867;
        padding: 8px;
        border-radius: 4px;
        font-size: 14px;
        transition: 300ms !important;
        font-weight: 400;
      }

      a:last-child:hover {
        border-color: rgb(25, 168, 25);
        background-color: rgb(25, 168, 25);
        color: #fafafa !important;
      }

      a[href] {
        color: #fafafa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hola <span> ${params.firstName}!</span></h1>
      <p>
        <b>¡Bienvenido a GaRecordfy!</b> Tu cuenta de correo electrónico ha sido
        registrada con éxito y
        <b style="color: rgb(194, 4, 4)">está a un paso de estar lista</b> para
        ser utilizada en la plataforma.
      </p>
      <p></p>
      <p>A continuación, te proporcionamos los detalles de tu cuenta:</p>
      <p>
        Nombre de Usuario: ${params.username} <br />
        Dirección de Correo Electrónico: ${params.email}
      </p>
      <p>
        <b
          >Por favor, ten en cuenta que tu dirección de correo electrónico es
          esencial para iniciar sesión y para cualquier comunicación relacionada
          con tu cuenta en GaRecordfy. Asegúrate de mantener esta información
          segura.
        </b>
      </p>
      <p>
        Si alguna vez olvidas tu contraseña o necesitas asistencia con tu
        cuenta, no dudes en contactarnos a través de nuestro equipo de soporte
        en <b>soporte@grupoavant.com.do</b>. Estaremos encantados de ayudarte en
        cualquier momento.
      </p>
      <p>
        <b style="color: rgb(194, 4, 4)"
          >Para ingresar a tu cuenta necesitas verificar tu acceso con el link
          de más abajo ↓</b
        >
      </p>
      <a href="https://h6v791zx-3001.use2.devtunnels.ms/api/auth/verify?${params.queryParams}" rel="nofollow" target="blank">Verificar mi cuenta</a>
    </div>
  </body>
</html>
`;
};
