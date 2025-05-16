import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table, Pagination, InputGroup, Spinner } from "react-bootstrap";
import { useUser } from "../../../context/UserContext";
import { UserType } from "../../../types/UserType";
import config from '../../../config/config.ts';

import LoadingScreen from "../../common/LoadingScreen";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

export type TableType = {
    id: number;
    qr_code: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

type Params = {
    page: number;
    item_per_page: number;
    search: string;
    search_by: 'name' | 'id';
}

export function TableComponent() {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useUser();
    const [tables, setTables] = useState<TableType[]>([]);
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [isLoadingAddTable, setIsLoadingAddTable] = useState(false);
    const [isLoadingTables, setIsLoadingTables] = useState(false);
    const [newTable, setNewTable] = useState<string>('');
    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentTable, setCurrentTable] = useState<TableType | null>(null);
    const [isLoadingUpdateTable, setIsLoadingUpdateTable] = useState(false);
    const [params, setParams] = useState<Params>({
        page: 1,
        item_per_page: 10,
        search: '',
        search_by: 'name',
    });
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchByInput, setSearchByInput] = useState<'name' | 'id'>('name');

    // Parse URL query parameters
    const updateParamsFromURL = () => {
        const searchParams = new URLSearchParams(location.search);
        const newParams: Params = {
            page: parseInt(searchParams.get('page') || '1', 10) || 1,
            item_per_page: parseInt(searchParams.get('item_per_page') || '10', 10) || 10,
            search: searchParams.get('search') || '',
            search_by: (searchParams.get('search_by') as 'name' | 'id') || 'name',
        };
        setParams(newParams);
        setSearchInput(newParams.search);
        setSearchByInput(newParams.search_by);
    };

    // Update URL when params change
    const updateURL = (newParams: Params) => {
        const searchParams = new URLSearchParams();
        if (newParams.page !== 1) searchParams.set('page', newParams.page.toString());
        if (newParams.item_per_page !== 10) searchParams.set('item_per_page', newParams.item_per_page.toString());
        if (newParams.search) searchParams.set('search', newParams.search);
        if (newParams.search_by !== 'name') searchParams.set('search_by', newParams.search_by);
        navigate({ search: searchParams.toString() }, { replace: true });
    };

    // Fetch tables
    const fetchTables = async (fetchParams: Params) => {
        if (!user?.access_token) {
            toast.error('Please log in to fetch tables');
            return;
        }
        setIsLoadingTables(true);
        try {
            const query = new URLSearchParams();
            query.set('page', fetchParams.page.toString());
            query.set('item_per_page', fetchParams.item_per_page.toString());
            if (fetchParams.search) query.set('search', fetchParams.search);
            if (fetchParams.search_by) query.set('search_by', fetchParams.search_by);

            const response = await fetch(`${config.API_URL}table?${query.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.access_token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tables');
            }
            const data = await response.json();
            setTables(data.data || []);
            setTotalPages(data.meta?.total_pages || 1);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Error fetching tables: ${errorMessage}`);
        } finally {
            setIsLoadingTables(false);
        }
    };

    // Fetch add table
    const fetchAddTable = async (tableName: string) => {
        if (!user?.access_token) {
            toast.error('Please log in to add a table');
            return;
        }
        setIsLoadingAddTable(true);
        try {
            const response = await fetch(`${config.API_URL}table`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.access_token}`,
                },
                body: JSON.stringify({ name: tableName }),
            });
            if (!response.ok) {
                throw new Error('Failed to add table');
            }
            const data = await response.json();
            toast.success(`Table added successfully: ${data.name}`);
            await fetchTables(params);
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Error adding table: ${errorMessage}`);
            throw error;
        } finally {
            setIsLoadingAddTable(false);
        }
    };

    const handleUpdate = async (name: string) => {
        if (!user?.access_token) {
            toast.error('Please log in to update a table');
            return;
        }
        setIsLoadingUpdateTable(true);
        try {
            if (!currentTable) {
                toast.error('No table selected for update');
                return;
            }
            const response = await fetch(`${config.API_URL}table/${currentTable.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.access_token}`,
                },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) {
                throw new Error('Failed to update table');
            }
            const data = await response.json();
            toast.success(`Table updated successfully: ${data.name}`);
            await fetchTables(params);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Error updating table: ${errorMessage}`);
        } finally {
            setIsLoadingUpdateTable(false);
            setIsShowModalUpdate(false);
            setCurrentTable(null);
            setNewTable('');
        }
    }

    // Fetch tables when params or user change
    useEffect(() => {
        updateParamsFromURL();
    }, [location.search]);

    useEffect(() => {
        if (user?.access_token) {
            fetchTables(params);
        }
    }, [params, user?.access_token]);

    // Handle search form submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newParams = { ...params, search: searchInput.trim(), search_by: searchByInput, page: 1 };
        setParams(newParams);
        updateURL(newParams);
    };

    // Handle search clear
    const handleSearchClear = () => {
        setSearchInput('');
        setSearchByInput('name');
        const newParams = { ...params, search: '', search_by: 'name' as const, page: 1 };
        setParams(newParams);
        updateURL(newParams);
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        const newParams = { ...params, page };
        setParams(newParams);
        updateURL(newParams);
    };

    return (
        <div className="p-3">

            {/* Search container */}
            <Form onSubmit={handleSearchSubmit} className="mb-4">
                <InputGroup>
                    <InputGroup.Text>
                        <Search size={20} />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Search tables..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Form.Select
                        style={{ maxWidth: '150px' }}
                        value={searchByInput}
                        onChange={(e) => setSearchByInput(e.target.value as 'name' | 'id')}
                    >
                        <option value="name">Name</option>
                        <option value="id">ID</option>
                    </Form.Select>
                    <Button variant="primary" type="submit" disabled={isLoadingTables}>
                        {isLoadingTables ? <Spinner size="sm" /> : 'Search'}
                    </Button>
                    <Button variant="outline-secondary" onClick={handleSearchClear} disabled={isLoadingTables}>
                        Clear
                    </Button>
                </InputGroup>
            </Form>

            {/* Control */}
            <div className="d-flex justify-content-start gap-2 align-items-center mb-3">
                <Button variant="primary" onClick={() => navigate('/admin/invoice')}>
                    Thông tin hóa đơn
                </Button>
                <Button variant="primary" onClick={() => setIsShowModalAdd(true)} disabled={isLoadingTables}>
                    Thêm bàn
                </Button>
            </div>

            {/* Table */}
            {isLoadingTables ? (
                <LoadingScreen />
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.length > 0 ? (
                            tables.map((table) => (
                                <tr key={table.id}>
                                    <td>{table.id}</td>
                                    <td>{table.name}</td>
                                    <td>{new Date(table.created_at).toLocaleString()}</td>
                                    <td>
                                        <Button variant="outline-danger" onClick={() => {
                                            setCurrentTable(table);
                                            setNewTable(table.name);
                                            setIsShowModalUpdate(true);
                                        }}>
                                            Sửa
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">No tables found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {/* Pagination */}
            {!isLoadingTables && tables.length > 0 && (
                <Pagination>
                    <Pagination.Prev
                        onClick={() => handlePageChange(params.page - 1)}
                        disabled={params.page === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Pagination.Item
                            key={page}
                            active={page === params.page}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(params.page + 1)}
                        disabled={params.page === totalPages}
                    />
                </Pagination>
            )}

            {/* Modal add table */}
            <Modal show={isShowModalAdd} onHide={() => setIsShowModalAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm bàn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Tên bàn</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên bàn"
                                value={newTable}
                                onChange={(e) => setNewTable(e.target.value)}
                                disabled={isLoadingAddTable}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsShowModalAdd(false)} disabled={isLoadingAddTable}>
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={async () => {
                            if (!newTable.trim()) {
                                toast.error('Vui lòng nhập tên bàn');
                                return;
                            }
                            setIsLoadingAddTable(true);
                            try {
                                await fetchAddTable(newTable);
                                setIsShowModalAdd(false);
                                setNewTable('');
                            } catch {
                                // Error handled in fetchAddTable
                            } finally {
                                setIsLoadingAddTable(false);
                            }
                        }}
                        disabled={isLoadingAddTable}
                    >
                        {isLoadingAddTable ? <Spinner size="sm" /> : 'Thêm'}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal update table */}
            <Modal show={isShowModalUpdate} onHide={() => setIsShowModalUpdate(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật bàn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Add your update form here */}
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Tên bàn</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên bàn"
                                value={newTable}
                                onChange={(e) => setNewTable(e.target.value)}
                                disabled={isLoadingAddTable}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsShowModalUpdate(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleUpdate(newTable)}>
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}