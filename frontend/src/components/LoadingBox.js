import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox({ size = 50 }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ width: size, height: size }}
        variant="warning" // o el color que prefieras para que combine con tu tema
      >
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  );
}
