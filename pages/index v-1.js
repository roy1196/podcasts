export default class extends React.Component {
  render() {
    return (
      <div>
        <h1>Hola mundo</h1>
        <p>Bienvenido al curso de Next JS</p>

        <img src="/static/platzi-logo.png" alt="Platzi"/>

        <style jsx>{`
          h1 {
            color: red;
          }
          :global(p) {
            color: gray;
          }

          img{
              max-width: 50%;
              display:block;
              margin: 0 auto;
          }
        `}</style>

        <style jsx global>{`
            body{
                background-color: black
            }
        `}</style>
      </div>
    );
  }
}
