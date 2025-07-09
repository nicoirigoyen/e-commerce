import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  Container,
  Form,
  Button,
  ListGroup,
  Row,
  Col,
} from 'react-bootstrap';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, { loading: true, error: '' });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        const [main, sub] = data.category.split('/');
        setMainCategory(main);
        setSubCategory(sub);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [productId]);

  const uploadFileHandler = (e, forImages = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      if (img.width !== 1200 || img.height !== 1200) {
        toast.error(
          'La imagen debe tener exactamente 1200x1200 píxeles. Usá https://www.photopea.com para editarla.'
        );
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        dispatch({ type: 'UPLOAD_REQUEST' });
        const { data } = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'UPLOAD_SUCCESS' });

        if (forImages) {
          setImages([...images, data.secure_url]);
        } else {
          setImage(data.secure_url);
        }
        toast.success('Imagen subida correctamente. Presioná "Modificar" para guardar.');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      }
    };
  };

  const deleteFileHandler = (fileName) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success('Imagen eliminada. Presioná "Modificar" para guardar.');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category: `${mainCategory}/${subCategory}`,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Producto modificado correctamente');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className="py-4">
      <Helmet>
        <title>Editar producto</title>
      </Helmet>
      <div
        className="p-4"
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          color: '#eee',
          boxShadow: '0 0 10px rgba(0,255,255,0.1)',
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: '#58f0ff' }}>
          Editar producto
        </h2>

        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-dark text-light border-secondary"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="slug">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="countInStock">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="brand">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="mainCategory">
                  <Form.Label>Categoría principal</Form.Label>
                  <Form.Select
                    value={mainCategory}
                    onChange={(e) => {
                      setMainCategory(e.target.value);
                      setSubCategory('');
                    }}
                    className="bg-dark text-light border-secondary"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Componentes">Componentes</option>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Monitores">Monitores</option>
                    <option value="Audio">Audio</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Redes">Redes</option>
                    <option value="Almacenamiento">Almacenamiento</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="subCategory">
                  <Form.Label>Subcategoría</Form.Label>
                  <Form.Select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    disabled={!mainCategory}
                  >
                    <option value="">Seleccionar</option>

                    {mainCategory === 'Componentes' && (
                      <>
                        <option value="Procesadores">Procesadores</option>
                        <option value="Placas Madre">Placas Madre</option>
                        <option value="Memorias RAM">Memorias RAM</option>
                        <option value="Placas de Video">Placas de Video</option>
                        <option value="Fuentes">Fuentes</option>
                        <option value="Gabinetes">Gabinetes</option>
                        <option value="Coolers">Coolers</option>
                      </>
                    )}

                    {mainCategory === 'Periféricos' && (
                      <>
                        <option value="Teclados">Teclados</option>
                        <option value="Mouse">Mouse</option>
                        <option value="Auriculares">Auriculares</option>
                        <option value="Combos">Combos</option>
                        <option value="Webcams">Webcams</option>
                        <option value="Joysticks">Joysticks</option>
                      </>
                    )}

                    {mainCategory === 'Monitores' && (
                      <>
                        <option value="21.5 pulgadas">21.5 pulgadas</option>
                        <option value="24 pulgadas">24 pulgadas</option>
                        <option value="27 pulgadas">27 pulgadas</option>
                        <option value="Gaming">Gaming</option>
                      </>
                    )}

                    {mainCategory === 'Audio' && (
                      <>
                        <option value="Parlantes">Parlantes</option>
                        <option value="Auriculares Bluetooth">Auriculares Bluetooth</option>
                        <option value="Auriculares con cable">Auriculares con cable</option>
                      </>
                    )}

                    {mainCategory === 'Accesorios' && (
                      <>
                        <option value="Pads">Pads</option>
                        <option value="Cables">Cables</option>
                        <option value="Soportes">Soportes</option>
                      </>
                    )}

                    {mainCategory === 'Redes' && (
                      <>
                        <option value="Routers">Routers</option>
                        <option value="Adaptadores WiFi">Adaptadores WiFi</option>
                        <option value="Switches">Switches</option>
                      </>
                    )}

                    {mainCategory === 'Almacenamiento' && (
                      <>
                        <option value="Discos SSD">Discos SSD</option>
                        <option value="Discos HDD">Discos HDD</option>
                        <option value="Pendrives">Pendrives</option>
                      </>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="image">
                  <Form.Label>Imagen principal (1200x1200px)</Form.Label>
                  <Form.Control
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="imageFile">
                  <Form.Label>Cargar imagen principal</Form.Label>
                  <Form.Control type="file" onChange={(e) => uploadFileHandler(e)} />
                  {loadingUpload && <LoadingBox />}
                </Form.Group>

                <Form.Group className="mb-3" controlId="additionalImage">
                  <Form.Label>Imágenes adicionales</Form.Label>
                  <ListGroup variant="flush">
                    {images.map((x) => (
                      <ListGroup.Item
                        key={x}
                        className="d-flex justify-content-between align-items-center bg-dark text-light"
                      >
                        {x}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteFileHandler(x)}
                        >
                          <i className="fas fa-times" />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="additionalImageFile">
                  <Form.Label>Cargar imagen adicional</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => uploadFileHandler(e, true)}
                  />
                  {loadingUpload && <LoadingBox />}
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-dark text-light border-secondary"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid mt-3">
              <Button
                type="submit"
                variant="primary"
                disabled={loadingUpdate}
                style={{
                  backgroundColor: '#D12B19',
                  border: 'none',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                }}
              >
                Modificar producto
              </Button>
              {loadingUpdate && <LoadingBox />}
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
}
