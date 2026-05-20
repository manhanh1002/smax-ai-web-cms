"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { 
  Users, UserPlus, Search, Shield, Mail, Calendar, Trash2, Edit2, Key, CheckSquare, Square
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const DEFAULT_PERMISSIONS = {
  pages: true,
  blog: true,
  marketing: true,
  media: true,
  members: false,
  settings: false
};

const ALL_PERMISSIONS = {
  pages: true,
  blog: true,
  marketing: true,
  media: true,
  members: true,
  settings: true
};

const PERMISSION_LABELS: Record<string, string> = {
  pages: "Pages Builder",
  blog: "Blog & Content",
  marketing: "Marketing Tools",
  media: "Media Assets",
  members: "Quản trị Thành viên",
  settings: "Cài đặt hệ thống"
};

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAdminUser, setCurrentAdminUser] = useState<any>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  
  // Action states
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [newMember, setNewMember] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "staff",
    permissions: { ...DEFAULT_PERMISSIONS }
  });

  const [editingMember, setEditingMember] = useState<any>({
    id: "",
    email: "",
    password: "",
    fullName: "",
    role: "staff",
    permissions: { ...DEFAULT_PERMISSIONS }
  });

  useEffect(() => {
    fetchMembers();
    fetchCurrentAdmin();
  }, []);

  async function fetchCurrentAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentAdminUser(user);
    }
  }

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Lỗi lấy danh sách thành viên: " + error.message);
    } else if (data) {
      setMembers(data);
    }
    setLoading(false);
  }

  const filteredMembers = members.filter(m => 
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChangeForNew = (role: string) => {
    setNewMember((prev: any) => ({
      ...prev,
      role,
      permissions: role === "admin" ? { ...ALL_PERMISSIONS } : { ...DEFAULT_PERMISSIONS }
    }));
  };

  const handleRoleChangeForEdit = (role: string) => {
    setEditingMember((prev: any) => ({
      ...prev,
      role,
      permissions: role === "admin" ? { ...ALL_PERMISSIONS } : { ...DEFAULT_PERMISSIONS }
    }));
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error("Không tìm thấy phiên làm việc. Vui lòng đăng nhập lại.");
        setAdding(false);
        return;
      }

      const response = await fetch("/vi/api/admin/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newMember.email,
          password: newMember.password,
          fullName: newMember.fullName,
          role: newMember.role,
          permissions: newMember.permissions
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Tạo thành viên thất bại");
      }

      toast.success("Tạo thành viên thành công!");
      setShowAddModal(false);
      setNewMember({
        email: "",
        password: "",
        fullName: "",
        role: "staff",
        permissions: { ...DEFAULT_PERMISSIONS }
      });
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi");
    } finally {
      setAdding(false);
    }
  };

  const handleOpenEditModal = (member: any) => {
    setEditingMember({
      id: member.id,
      email: member.email,
      password: "", // Leave blank unless they want to change it
      fullName: member.full_name || "",
      role: member.role || "staff",
      permissions: member.permissions || { ...DEFAULT_PERMISSIONS }
    });
    setShowEditModal(true);
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error("Không tìm thấy phiên làm việc.");
        setUpdating(false);
        return;
      }

      const response = await fetch("/vi/api/admin/members", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingMember.id,
          email: editingMember.email,
          password: editingMember.password || undefined,
          fullName: editingMember.fullName,
          role: editingMember.role,
          permissions: editingMember.permissions
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Cập nhật thành viên thất bại");
      }

      toast.success("Cập nhật thành viên thành công!");
      setShowEditModal(false);
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error("Không tìm thấy phiên làm việc.");
        return;
      }

      const response = await fetch(`/vi/api/admin/members?id=${memberToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Xóa thành viên thất bại");
      }

      toast.success("Xóa thành viên thành công!");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi");
    } finally {
      setMemberToDelete(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            Quản lý Thành viên
          </h1>
          <p className="text-sm text-slate-400 mt-1">Quản lý đội ngũ vận hành và phân quyền hệ thống chi tiết (WordPress style).</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <UserPlus className="w-4 h-4" />
          Thêm thành viên mới
        </Button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-11 text-sm outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl px-5 flex items-center justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng số</span>
          <span className="text-xl font-black text-slate-900">{members.length}</span>
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
            >
              <form onSubmit={handleAddMember} className="flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-slate-100 shrink-0">
                  <h3 className="text-xl font-black text-slate-900">Thêm thành viên mới</h3>
                  <p className="text-xs text-slate-400 mt-1">Tài khoản sẽ được tự động kích hoạt để có thể đăng nhập ngay.</p>
                </div>
                
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Họ và tên</label>
                      <input 
                        required
                        value={newMember.fullName}
                        onChange={e => setNewMember({...newMember, fullName: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all outline-none text-sm font-semibold text-slate-800" 
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vai trò</label>
                      <select 
                        value={newMember.role}
                        onChange={e => handleRoleChangeForNew(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all outline-none text-sm font-semibold text-slate-800"
                      >
                        <option value="staff">Staff (Nhân viên)</option>
                        <option value="admin">Admin (Quản trị viên)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email đăng nhập</label>
                      <input 
                        type="email"
                        required
                        value={newMember.email}
                        onChange={e => setNewMember({...newMember, email: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all outline-none text-sm font-semibold text-slate-800" 
                        placeholder="email@company.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mật khẩu khởi tạo</label>
                      <input 
                        type="password"
                        required
                        value={newMember.password}
                        onChange={e => setNewMember({...newMember, password: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all outline-none text-sm font-semibold text-slate-800" 
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Permissions checkboxes */}
                  <div className="space-y-2 border border-slate-100 bg-slate-50/50 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Quyền hạn truy cập các module</label>
                      {newMember.role === "admin" && (
                        <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Full Access</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
                        const isChecked = newMember.role === "admin" ? true : (newMember.permissions as any)[key];
                        return (
                          <label 
                            key={key} 
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              isChecked 
                                ? "bg-white border-primary/20 text-slate-900 shadow-sm" 
                                : "bg-white/50 border-slate-200/60 text-slate-400"
                            } ${newMember.role === "admin" ? "cursor-not-allowed opacity-80" : ""}`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              disabled={newMember.role === "admin"}
                              onChange={(e) => {
                                setNewMember({
                                  ...newMember,
                                  permissions: {
                                    ...newMember.permissions,
                                    [key]: e.target.checked
                                  }
                                });
                              }}
                              className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 flex items-center gap-3 border-t border-slate-100 shrink-0">
                  <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1 rounded-xl font-bold hover:bg-slate-200/50">Hủy</Button>
                  <Button type="submit" disabled={adding} className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {adding ? "Đang tạo..." : "Xác nhận tạo"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
            >
              <form onSubmit={handleUpdateMember} className="flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-slate-100 shrink-0">
                  <h3 className="text-xl font-black text-slate-900">Cập nhật thành viên</h3>
                  <p className="text-xs text-slate-400 mt-1">Thay đổi quyền hạn, vai trò và thông tin cá nhân của thành viên.</p>
                </div>
                
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Họ và tên</label>
                      <input 
                        required
                        value={editingMember.fullName}
                        onChange={e => setEditingMember({...editingMember, fullName: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all outline-none text-sm font-semibold text-slate-800" 
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vai trò</label>
                      <select 
                        value={editingMember.role}
                        disabled={editingMember.id === currentAdminUser?.id}
                        onChange={e => handleRoleChangeForEdit(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all outline-none text-sm font-semibold text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="staff">Staff (Nhân viên)</option>
                        <option value="admin">Admin (Quản trị viên)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email đăng nhập</label>
                      <input 
                        type="email"
                        required
                        value={editingMember.email}
                        onChange={e => setEditingMember({...editingMember, email: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all outline-none text-sm font-semibold text-slate-800" 
                        placeholder="email@company.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 ml-1">
                        <Key className="w-3 h-3 text-slate-400" />
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mật khẩu mới</label>
                      </div>
                      <input 
                        type="password"
                        value={editingMember.password}
                        onChange={e => setEditingMember({...editingMember, password: e.target.value})}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary transition-all outline-none text-sm font-semibold text-slate-800" 
                        placeholder="Để trống nếu không đổi"
                      />
                    </div>
                  </div>

                  {/* Permissions checkboxes */}
                  <div className="space-y-2 border border-slate-100 bg-slate-50/50 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Quyền hạn truy cập các module</label>
                      {editingMember.role === "admin" && (
                        <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Full Access</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(PERMISSION_LABELS).map(([key, label]) => {
                        const isChecked = editingMember.role === "admin" ? true : (editingMember.permissions as any)[key];
                        const isDisabled = editingMember.role === "admin" || editingMember.id === currentAdminUser?.id;
                        return (
                          <label 
                            key={key} 
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                              isChecked 
                                ? "bg-white border-primary/20 text-slate-900 shadow-sm" 
                                : "bg-white/50 border-slate-200/60 text-slate-400"
                            } ${isDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              disabled={isDisabled}
                              onChange={(e) => {
                                setEditingMember({
                                  ...editingMember,
                                  permissions: {
                                    ...editingMember.permissions,
                                    [key]: e.target.checked
                                  }
                                });
                              }}
                              className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 flex items-center gap-3 border-t border-slate-100 shrink-0">
                  <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)} className="flex-1 rounded-xl font-bold hover:bg-slate-200/50">Hủy</Button>
                  <Button type="submit" disabled={updating} className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/20">
                    {updating ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!memberToDelete}
        title="Xóa thành viên"
        description={`Bạn có chắc chắn muốn xóa thành viên "${memberToDelete?.full_name || memberToDelete?.email}" khỏi hệ thống? Hành động này sẽ thu hồi toàn bộ quyền truy cập và không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        onConfirm={handleDeleteMember}
        onClose={() => setMemberToDelete(null)}
      />

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thành viên</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quyền hạn kích hoạt</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tham gia</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy thành viên nào.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden font-black text-sm">
                          {member.avatar_url ? <img src={member.avatar_url} className="w-full h-full object-cover" /> : member.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            {member.full_name || "Chưa đặt tên"}
                            {member.id === currentAdminUser?.id && (
                              <span className="text-[8px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Bạn</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        member.role === 'admin' 
                          ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[280px]">
                      {member.role === "admin" ? (
                        <span className="text-[10px] font-bold text-slate-500 italic">Tất cả các module</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(member.permissions || {})
                            .filter(([_, val]) => val === true)
                            .map(([key]) => (
                              <span key={key} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {PERMISSION_LABELS[key] || key}
                              </span>
                            ))
                          }
                          {Object.values(member.permissions || {}).filter(val => val === true).length === 0 && (
                            <span className="text-[10px] font-bold text-red-400 italic">Không có quyền truy cập</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {new Date(member.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEditModal(member)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {member.id !== currentAdminUser?.id && member.email !== "manhanh0210@gmail.com" && (
                          <button 
                            onClick={() => setMemberToDelete(member)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
