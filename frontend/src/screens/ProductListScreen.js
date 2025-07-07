import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });

        // Mostrar toast solo si venimos de crear un producto
        const wasCreated = localStorage.getItem('productCreated');
        if (wasCreated) {
          toast.success('Producto creado correctamente');
          localStorage.removeItem('productCreated');
        }
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm('¿Crear nuevo producto?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        // Guardar bandera en localStorage
        localStorage.setItem('productCreated', 'true');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'CREATE_FAIL' });
      }
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Producto eliminado correctamente');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
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
      <Helmet>
        <title>Lista de productos</title>
      </Helmet>
      <Row className="align-items-center mb-3">
        <Col>
          <h2 style={{ color: '#58f0ff' }}>Productos</h2>
        </Col>
        <Col className="text-end">
          <Button
            type="button"
            onClick={createHandler}
            style={{
              backgroundColor: '#D12B19',
              border: 'none',
              fontWeight: 'bold',
              borderRadius: '10px',
            }}
          >
            Crear Producto
          </Button>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox />}
      {loadingDelete && <LoadingBox />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-dark table-hover table-bordered align-middle text-center">
              <thead className="table-light text-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <Button
                        type="button"
                        variant="outline-info"
                        size="sm"
                        onClick={() => navigate(`/admin/product/${product._id}`)}
                        className="me-2"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteHandler(product)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
            {[...Array(pages).keys()].map((x) => (
              <Link
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
                className={`btn ${
                  Number(page) === x + 1 ? 'btn-primary' : 'btn-outline-light'
                }`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
