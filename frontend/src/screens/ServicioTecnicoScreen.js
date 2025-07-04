import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';

export default function ServicioTecnicoScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const maxCaracteres = 500;

  //ESTO LO SACAS DE https://dashboard.emailjs.com/admin/account nitecnosoporte@gmail.com
  const serviceId = 'service_ir3m0y9';
  const templateId = 'template_fgjq36w';
  const userId = 'gERnl4VBb2CGxIEUu'; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const templateParams = {
      name: nombre,
      email: email,
      message: mensaje,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, userId);
      toast.success('Consulta enviada correctamente. Te responderemos pronto.', {
        position: 'top-center',
      });
      setNombre('');
      setEmail('');
      setMensaje('');
    } catch (err) {
      console.error(err);
      toast.error('Error al enviar la consulta. Intentá de nuevo más tarde.', {
        position: 'top-center',
      });
    }
  };

  const handleWhatsApp = () => {
    const texto = encodeURIComponent(
      `Hola, soy ${nombre}. Necesito asistencia técnica.\n\nMensaje:\n${mensaje}`
    );
    window.open(`https://wa.me/543512278898?text=${texto}`, '_blank');
  };

  return (
    <Container
      className="small-container d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '80vh' }}
    >
      <Helmet>
        <title>Servicio Técnico</title>
      </Helmet>

      <div
        className="p-4 shadow-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px',
          animation: 'fadeIn 0.6s ease-in-out',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#eeeeee' }}>
          Consulta Técnica <span style={{ color: '#D12B19' }}>NiTecno</span>
        </h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label style={{ color: '#ccc' }}>Nombre</Form.Label>
            <Form.Control
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label style={{ color: '#ccc' }}>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="mensaje">
            <Form.Label style={{ color: '#ccc' }}>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={maxCaracteres}
              required
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Contanos qué problema estás teniendo..."
              style={{
                backgroundColor: '#ffffff0a',
                color: '#f0f0f0',
                border: '1px solid #444',
                borderRadius: '8px',
              }}
            />
            <div className="text-end" style={{ color: '#888', fontSize: '0.8rem' }}>
              {mensaje.length}/{maxCaracteres}
            </div>
          </Form.Group>

          <div className="d-grid gap-2 mb-3">
            <Button
              type="submit"
              variant="primary"
              style={{
                backgroundColor: '#1e3a8a',
                border: 'none',
                fontWeight: '600',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#254EDB';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1e3a8a';
              }}
            >
              Enviar consulta
            </Button>

            <Button
              type="button"
              variant="success"
              onClick={handleWhatsApp}
              style={{
                backgroundColor: '#25D366',
                border: 'none',
                fontWeight: '600',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1ebc5b';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#25D366';
              }}
            >
              Contactar por WhatsApp
            </Button>
          </div>
        </Form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
}
