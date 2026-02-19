import React, { useState, useEffect } from 'react';
import { Video, Users, Heart, Loader2, ArrowUpRight, Search } from 'lucide-react';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';

const AdminReelAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ totalReels: 0, userStats: [] });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await adminService.getReelAnalysis();
            if (res.success) {
                setData({
                    totalReels: res.totalReels,
                    userStats: res.userStats
                });
            }
        } catch (error) {
            console.error('Error fetching reel analysis:', error);
            toast.error('Failed to load reel analysis');
        } finally {
            setLoading(false);
        }
    };

    const filteredStats = data.userStats.filter(user =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userPhone.includes(searchTerm)
    );

    const totalLikes = data.userStats.reduce((acc, curr) => acc + curr.totalLikes, 0);
    const totalUsers = data.userStats.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reel Analysis</h1>
                    <p className="text-gray-500 text-sm">Monitor reel engagement and user activity</p>
                </div>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Refresh Data
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Reels"
                    value={data.totalReels}
                    icon={<Video className="w-6 h-6 text-blue-500" />}
                    color="bg-blue-50"
                />
                <StatCard
                    title="Contributors"
                    value={totalUsers}
                    icon={<Users className="w-6 h-6 text-purple-500" />}
                    color="bg-purple-50"
                />
                <StatCard
                    title="Total Engagement"
                    value={totalLikes}
                    subtitle="Total Likes"
                    icon={<Heart className="w-6 h-6 text-red-500" />}
                    color="bg-red-50"
                />
            </div>

            {/* Analysis Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-800">User Performance</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Reels Posted</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Total Likes</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Engagement Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStats.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{user.userName}</span>
                                            <span className="text-xs text-gray-500">{user.userPhone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700 font-medium">
                                        {user.reelCount}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 text-sm text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full">
                                            <Heart size={14} className="fill-current" />
                                            {user.totalLikes}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1 text-sm text-emerald-600 font-bold">
                                            {(user.totalLikes / user.reelCount).toFixed(1)} <span className="text-[10px] text-gray-400 font-normal">avg/reel</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStats.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                                        No matching users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
                {subtitle && <span className="text-xs text-gray-400 font-medium">{subtitle}</span>}
            </div>
        </div>
    </div>
);

export default AdminReelAnalysis;
