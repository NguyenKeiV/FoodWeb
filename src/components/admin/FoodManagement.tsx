import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface Food {
    id: number;
    name: string;
    price: number;
    quantity: number;
    img: string | null;
    category: string | null;
    created_at: string;
    updated_at: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}

interface PaginatedResponse {
    foods: Food[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        offset: number;
    };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const FoodManagement: React.FC = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category: 'food'
    });

    useEffect(() => {
        fetchFoods();
    }, [currentPage]);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            if (searchTerm) {
                handleSearch();
            } else {
                fetchFoods();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/foods?page=${currentPage}&limit=12`);
            const data: ApiResponse<Food[]> = await response.json();

            if (data.success) {
                setFoods(data.data);
                // Nếu có pagination trong response
                if ('pagination' in data) {
                    const paginatedData = data as unknown as ApiResponse<PaginatedResponse>;
                    setTotalPages(paginatedData.data.pagination?.totalPages || 1);
                }
            } else {
                console.error('Error:', data.message);
                alert('Không thể tải danh sách món ăn: ' + (data.error || data.message));
            }
        } catch (error) {
            console.error('Error fetching foods:', error);
            alert('Không thể kết nối đến server!');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchFoods();
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/foods/search?q=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=12`);
            const data: ApiResponse<Food[]> = await response.json();

            if (data.success) {
                setFoods(data.data);
                if ('pagination' in data) {
                    const paginatedData = data as unknown as ApiResponse<PaginatedResponse>;
                    setTotalPages(paginatedData.data.pagination?.totalPages || 1);
                }
            } else {
                console.error('Error:', data.message);
                setFoods([]);
            }
        } catch (error) {
            console.error('Error searching foods:', error);
            alert('Không thể tìm kiếm!');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh!');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước ảnh không được vượt quá 5MB!');
                return;
            }

            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.name.trim()) {
            alert('Tên món ăn không được để trống!');
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert('Giá phải lớn hơn 0!');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập!');
            return;
        }

        try {
            const url = editingFood
                ? `${API_BASE_URL}/foods/${editingFood.id}`
                : `${API_BASE_URL}/foods`;

            const submitFormData = new FormData();
            submitFormData.append('name', formData.name.trim());
            submitFormData.append('price', formData.price);
            submitFormData.append('quantity', formData.quantity || '0');
            submitFormData.append('category', formData.category);

            // Chỉ append image nếu có file mới
            if (imageFile) {
                submitFormData.append('image', imageFile);
            }

            const response = await fetch(url, {
                method: editingFood ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitFormData
            });

            const data: ApiResponse<Food> = await response.json();

            if (data.success) {
                alert(editingFood ? 'Cập nhật thành công!' : 'Thêm món ăn thành công!');
                fetchFoods();
                handleCloseModal();
            } else {
                alert('Có lỗi xảy ra: ' + (data.error || data.message));
            }
        } catch (error) {
            console.error('Error saving food:', error);
            alert('Không thể lưu món ăn!');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa món ăn này?')) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data: ApiResponse<null> = await response.json();

            if (data.success) {
                alert('Xóa thành công!');
                fetchFoods();
            } else {
                alert('Có lỗi xảy ra: ' + (data.error || data.message));
            }
        } catch (error) {
            console.error('Error deleting food:', error);
            alert('Không thể xóa món ăn!');
        }
    };

    const handleEdit = (food: Food) => {
        setEditingFood(food);
        setFormData({
            name: food.name,
            price: food.price.toString(),
            quantity: food.quantity.toString(),
            category: food.category || 'food'
        });

        // Set image preview nếu có
        if (food.img) {
            // Nếu img là relative path, thêm base URL
            const imageUrl = food.img.startsWith('http')
                ? food.img
                : `http://localhost:3000${food.img}`;
            setImagePreview(imageUrl);
        } else {
            setImagePreview('');
        }

        setImageFile(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingFood(null);
        setImagePreview('');
        setImageFile(null);
        setFormData({
            name: '',
            price: '',
            quantity: '',
            category: 'food'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getImageUrl = (img: string | null) => {
        if (!img) return 'https://via.placeholder.com/400x300?text=No+Image';
        if (img.startsWith('http')) return img;
        return `http://localhost:3000${img}`;
    };

    if (loading && foods.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm món ăn..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                    <Plus size={20} />
                    Thêm món ăn
                </button>
            </div>

            {foods.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">Không tìm thấy món ăn nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foods.map((food) => (
                        <div key={food.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                            <div className="relative h-48">
                                <img
                                    src={getImageUrl(food.img)}
                                    alt={food.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                    }}
                                />
                                <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-semibold">
                                    Còn {food.quantity}
                                </div>
                                {food.category && (
                                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                                        {food.category === 'food' ? 'Đồ ăn' : 'Đồ uống'}
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white mb-2">{food.name}</h3>
                                <p className="text-emerald-400 font-bold text-xl mb-4">{formatPrice(food.price)}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(food)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                                    >
                                        <Edit2 size={16} />
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(food.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                    >
                                        <Trash2 size={16} />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-slate-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2 text-white">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-slate-800/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-all"
                    >
                        Sau
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white">
                                {editingFood ? 'Sửa món ăn' : 'Thêm món ăn mới'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Tên món ăn <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                    placeholder="Ví dụ: Salad ức gà"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Giá (VNĐ) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="1000"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                        placeholder="50000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Số lượng</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                        placeholder="10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Hình ảnh món ăn</label>
                                {imagePreview && (
                                    <div className="mb-4 relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview('');
                                                setImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                <label className="block cursor-pointer">
                                    <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-all">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                                <Plus className="text-emerald-400" size={24} />
                                            </div>
                                            <p className="text-white font-medium">
                                                {imagePreview ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                                            </p>
                                            <p className="text-gray-400 text-xs">PNG, JPG, WEBP (tối đa 5MB)</p>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Danh mục</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="food">Đồ ăn</option>
                                    <option value="drink">Đồ uống</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all"
                                >
                                    {editingFood ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodManagement;