import { userService } from "../../services/api";
import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  User,
  Edit2,
  X,
  Check,
} from "lucide-react";

const RoleBadge = ({ rol }) => {
  const isAdmin = rol === "admin" || rol === 1;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
      ${isAdmin ? "bg-violet-50 text-violet-700" : "bg-teal-50 text-teal-700"}`}
    >
      {isAdmin ? <Shield size={11} /> : <User size={11} />}
      {isAdmin ? "Administrador" : "Médico"}
    </span>
  );
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await userService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtrado local — pocos usuarios, no merece paginación servidor
  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      u.correo?.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || String(u.id_rol) === filterRole;
    return matchSearch && matchRole;
  });

  const handleUpdateName = async (userId) => {
    try {
      await userService.updateUser(userId, { nombre: editName });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, nombre: editName } : u)),
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
    }
  };

  const handleChangeRole = async (userId, currentRol) => {
    const newRole = currentRol === 1 ? 2 : 1; // toggle entre admin(1) y médico(2)
    try {
      await userService.changeUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, id_rol: newRole } : u)),
      );
    } catch (err) {
      console.error("Error al cambiar rol:", err);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Gestión de usuarios
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los usuarios y sus permisos
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-100 rounded-lg">
          <Users size={14} className="text-teal-600" />
          <span className="text-xs font-medium text-teal-700">
            {users.length} usuarios
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600
                         placeholder:text-gray-400"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700
                       focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          >
            <option value="">Todos los roles</option>
            <option value="1">Administrador</option>
            <option value="2">Médico</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Usuario
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Rol
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <Users size={28} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    No se encontraron usuarios
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Nombre */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                        <span className="text-teal-700 font-semibold text-xs">
                          {user.nombre?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {editingId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs
                                       focus:outline-none focus:ring-1 focus:ring-teal-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateName(user.id)}
                            className="p-1 rounded text-teal-600 hover:bg-teal-50"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded text-gray-400 hover:bg-gray-100"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-700">
                          {user.nombre}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {user.correo}
                  </td>

                  {/* Rol */}
                  <td className="px-6 py-4">
                    <RoleBadge rol={user.id_rol} />
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    {editingId !== user.id && (
                      <div className="flex items-center gap-1">
                        {/* Editar nombre */}
                        <button
                          onClick={() => {
                            setEditingId(user.id);
                            setEditName(user.nombre);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                          title="Editar nombre"
                        >
                          <Edit2 size={13} />
                        </button>

                        {/* Cambiar rol */}
                        <button
                          onClick={() => handleChangeRole(user.id, user.id_rol)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                          title="Cambiar rol"
                        >
                          <Shield size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;
