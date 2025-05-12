import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { foodType, categoryType } from "../../../types/ProductTpye";

import LoadingScreen from "../../common/LoadingScreen";

type createCategoryType = {
    name: string;
    description: string;
}



function Category() {
    // auth
    const { user, isLoading } = useUser();
    const [IsLoadinglocal, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // var
    const [createCategory, setCreateCategory] = useState<createCategoryType>({
        name: '',
        description: '',
    });
    const [categoryselect, setCategorySelect] = useState<categoryType | null>(null);
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [imgfile, setImgfile] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState<categoryType[]>([]);




    // handle
    const handleEdit = async (cat: categoryType, imgfile: File | null) => {
        setIsLoading(true);
        if (cat.name && cat.description) {

            await fetchEditCategory(cat.id, cat);
            if (imgfile) {
                await fetchAddImg(cat.id, imgfile);
            }
            setIsShowModalEdit(false);
            setCategorySelect(null);
        } else {
            alert('Vui lòng nhập đầy đủ thông tin!');
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => { };

    const handleAdd = async () => {
        // setShowModal(true);
        setIsLoading(true);
        if (createCategory.name && createCategory.description && imgfile) {
            // Call API to create category
            const data = await fetchCreateCategory();
            if (data) {
                // Call API to upload image
                const imgData = await fetchAddImg(data.id, imgfile);
                if (imgData) {
                    alert('Thêm danh mục thành công!');
                    setShowModal(false);
                    await fetchCategory();
                }
            }
        } else {
            alert('Vui lòng nhập đầy đủ thông tin!');
        }
        setIsLoading(false);
    };


    // fetch

    const fetchEditCategory = async (id: number, cat: categoryType) => {
        const formData = new FormData();
        formData.append('name', cat.name);
        formData.append('description', cat.description);
        formData.append('status', cat.status.toString());

        const response = await fetch(`http://localhost:9999/category/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.access_token}`,
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Sửa danh mục thành công!');
            await fetchCategory();
        } else {
            alert('Sửa danh mục không thành công!');
        }
    };

    const fetchCreateCategory = async () => {

        const response = await fetch('http://localhost:9999/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.access_token}`,
            },
            body: JSON.stringify(createCategory),
        });
        const data = await response.json();

        if (response.ok) {
            alert('Thêm danh mục thành công!');
            // setShowModal(false);
            return data;
            fetchCategory();
        } else {
            alert('Thêm danh mục không thành công!');
        }
    };


    const fetchAddImg = async (id: number, file: File) => {
        const formData = new FormData();
        formData.append('image-category', file);

        const response = await fetch(`http://localhost:9999/category/${id}/upload-image-category`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user?.access_token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Hình ảnh đã được thêm thành công:', data);
            return data;
        } else {
            alert('Thêm hình ảnh không thành công!');
        }
    }

    const fetchCategory = async () => {
        setIsLoading(true);
        const response = await fetch('http://localhost:9999/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.access_token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {

            setCategory(data.data);
        } else {
            alert('Lấy danh mục không thành công!');
        }
        setIsLoading(false);
    };



    // fetch category data
    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(() => {
        console.log(category);
    }, [category]);

    if (isLoading || IsLoadinglocal) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <h1>Category</h1>

            <div className="d-flex mb-3 gap-3">
                <Button variant="primary" onClick={() => { setShowModal(true) }}>
                    Thêm danh mục
                </Button>
                <Button variant="primary" onClick={() => { navigate('/admin/product') }}>
                    Thông tin sản phẩm
                </Button>
            </div>

            {/* Thêm nội dung cho trang danh mục */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Ngày tạo</th>
                        <th style={{ width: '130px' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {category.map((cat) => (
                        <tr key={cat.id}>
                            <td>
                                {cat.image && <img src={`http://localhost:9999/${cat.image}`} alt={cat.name} style={{ width: '60px', height: '60px' }} />}
                            </td>
                            <td>{cat.id}</td>
                            <td>{cat.name}</td>
                            <td>{cat.description}</td>
                            <td>{new Date(cat.created_at).toLocaleDateString()}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <div className="d-flex gap-2">
                                    <Button variant="warning" size="sm" onClick={() => { setIsShowModalEdit(true); setCategorySelect(cat) }}>
                                        Sửa
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>
                                        Xóa
                                    </Button>
                                </div>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
            {/* Modal thêm sản phẩm */}
            {/* <CategoryEdit /> */}
            <CategoryEdit item={categoryselect} isShow={isShowModalEdit} handleEdit={handleEdit} handleClose={() => { setIsShowModalEdit(false) }} />

            {/* Modal thêm danh mục */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control type="text" onChange={(e) => setCreateCategory({ ...createCategory, name: e.target.value })} placeholder="Tên danh mục" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control type="text" onChange={(e) => setCreateCategory({ ...createCategory, description: e.target.value })} placeholder="Mô tả" />
                        </Form.Group>

                        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Trạng thái" />
                        </Form.Group> */}

                        <Form.Group className="mb-3">
                            <Form.Label>Hình ảnh</Form.Label>
                            <Form.Control type="file" onChange={(e) => setImgfile((e.target as HTMLInputElement).files?.[0] || null)} />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { }}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default Category;


type CategoryEditProps = {
    item: categoryType | null;
    isShow: boolean;
    handleEdit: (cat: categoryType, imgfile: File | null) => void;
    handleClose: () => void;
};


const CategoryEdit: React.FC<CategoryEditProps> = ({ item, isShow, handleEdit, handleClose }) => {

    const [imgfile, setImgfile] = useState<File | null>(null);

    const [cloneItem, setCloneItem] = useState<categoryType | null>(null);

    useEffect(() => {
        if (!isShow) {
            setImgfile(null);
            setCloneItem(null);
        } else {
            setCloneItem(item);
        }
    }, [isShow]);


    return (
        <div>
            {/* Modal sửa danh mục */}
            <Modal show={isShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên danh mục</Form.Label>
                            <Form.Control type="text" defaultValue={cloneItem?.name ?? ""} onChange={(e) => cloneItem?.id && setCloneItem({ ...cloneItem, name: e.target.value })} placeholder="Tên danh mục" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control type="text" defaultValue={cloneItem?.description ?? ""} onChange={(e) => cloneItem?.id && setCloneItem({ ...cloneItem, description: e.target.value })} placeholder="Mô tả" />
                        </Form.Group>

                        <div className="d-flex gap-3">
                            <div>
                                <img style={{ width: "70px", height: "70px" }} src={imgfile ? URL.createObjectURL(imgfile) : `http://localhost:9999/${cloneItem?.image}`} alt="" />
                            </div>
                            <div>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hình ảnh</Form.Label>
                                    <Form.Control type="file" onChange={(e) => setImgfile((e.target as HTMLInputElement).files?.[0] || null)} />
                                </Form.Group>
                            </div>
                        </div>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => cloneItem && handleEdit(cloneItem, imgfile)}>
                        Sửa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export { CategoryEdit };
