import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ruler, ChevronRight, Info } from 'lucide-react';

const SizeGuidePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('guide');
    const [selectedSize, setSelectedSize] = useState('S');
    const [subTab, setSubTab] = useState('body');

    const bodyData = [
        { size: 'S', us: '36', bust: '36.2-37.8', waist: '30.7-32.3', height: "5'7\"-5'9\"" },
        { size: 'M', us: '38', bust: '37.8-39.4', waist: '32.3-33.9', height: "5'9\"-5'11\"" },
        { size: 'L', us: '40', bust: '39.4-41.4', waist: '33.9-35.9', height: "5'11\"-6'1\"" },
        { size: 'XL', us: '42', bust: '41.4-43.3', waist: '35.9-37.8', height: "6'1\"-6'3\"" },
        { size: 'XXL', us: '44', bust: '43.3-45.3', waist: '37.8-40.2', height: "6'1\"-6'3\"" },
    ];

    const productData = [
        { size: 'S', shoulder: '17.5', chest: '41', length: '27.2', sleeve: '8.7' },
        { size: 'M', shoulder: '18.1', chest: '43', length: '28.0', sleeve: '9.1' },
        { size: 'L', shoulder: '18.7', chest: '45', length: '28.7', sleeve: '9.4' },
        { size: 'XL', shoulder: '19.3', chest: '47', length: '29.5', sleeve: '9.8' },
        { size: 'XXL', shoulder: '19.9', chest: '49', length: '30.3', sleeve: '10.2' },
    ];

    const currentData = subTab === 'body' ? bodyData : productData;

    return (
        <div className="bg-white min-h-screen text-[#1A0D0D] font-sans pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sm:py-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
                </button>
                <div className="flex gap-4 sm:gap-10">
                    <button 
                        onClick={() => setActiveTab('guide')}
                        className={`text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] pb-1.5 sm:pb-2 border-b-2 transition-all ${activeTab === 'guide' ? 'border-[#4C1414] text-[#4C1414]' : 'border-transparent text-gray-300'}`}
                    >
                        Size guide
                    </button>
                    <button 
                        onClick={() => setActiveTab('recommendation')}
                        className={`text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] pb-1.5 sm:pb-2 border-b-2 transition-all ${activeTab === 'recommendation' ? 'border-[#4C1414] text-[#4C1414]' : 'border-transparent text-gray-300'}`}
                    >
                        Recommendation
                    </button>
                </div>
                <div className="w-8 sm:w-10"></div>
            </div>

            <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-12">
                {activeTab === 'guide' ? (
                    <>
                        {/* Stretch Section */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Stretch Level</h3>
                            <div className="relative pt-8 max-w-2xl">
                                <div className="h-[2px] bg-gray-100 w-full rounded-full"></div>
                                <div className="absolute top-0 w-full flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <div className="flex flex-col items-start gap-3">
                                        <span>Non</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="text-[#4C1414]">Slight</span>
                                        <div className="w-3 h-3 rounded-full bg-[#4C1414] ring-4 ring-[#4C1414]/10"></div>
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <span>Medium</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <span>High</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Size Selector Section */}
                        <div className="flex flex-col md:flex-row md:items-center gap-6 py-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Size displayed:</span>
                                <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-[11px] font-bold bg-white hover:border-gray-400 transition-colors">
                                    Standard size <ChevronRight size={14} className="rotate-90 text-gray-400" />
                                </button>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[45px] h-11 rounded-full border text-xs font-bold transition-all ${selectedSize === size ? 'bg-[#4C1414] text-white border-[#4C1414] shadow-lg shadow-[#4C1414]/20' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Illustration Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-12 py-6 sm:py-10 items-center">
                            {/* Body Illustration */}
                            <div className="bg-gray-50/50 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden group">
                                <span className="absolute top-6 left-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Body Measurements</span>
                                <div className="relative w-full aspect-[3/4] max-w-[280px]">
                                    <svg viewBox="0 0 200 500" className="w-full h-full text-gray-200 fill-current">
                                        <path d="M100,40 C115,40 125,50 125,70 C125,90 115,100 100,100 C85,100 75,90 75,70 C75,50 85,40 100,40 M100,100 C80,100 60,120 50,150 L40,240 C38,250 45,255 50,250 L60,170 L60,340 L80,470 L100,470 L120,470 L140,340 L140,170 L150,250 C155,255 162,250 160,240 L150,150 C140,120 120,100 100,100" />
                                    </svg>
                                    
                                    {/* Measurements overlays */}
                                    <div className="absolute top-[150px] left-1/2 -translate-x-1/2 w-36 h-[1px] border-b-2 border-dashed border-[#ff8a00] flex justify-center group-hover:scale-105 transition-transform">
                                        <span className="bg-white px-3 py-0.5 text-[10px] text-[#ff8a00] font-black border-2 border-[#ff8a00] rounded-full -top-3.5 absolute shadow-sm">BUST: {bodyData.find(d => d.size === selectedSize).bust}</span>
                                    </div>
                                    <div className="absolute top-[210px] left-1/2 -translate-x-1/2 w-32 h-[1px] border-b-2 border-dashed border-[#ff8a00] flex justify-center group-hover:scale-105 transition-transform">
                                        <span className="bg-white px-3 py-0.5 text-[10px] text-[#ff8a00] font-black border-2 border-[#ff8a00] rounded-full -top-3.5 absolute shadow-sm">WAIST: {bodyData.find(d => d.size === selectedSize).waist}</span>
                                    </div>
                                    <div className="absolute right-0 top-[80px] h-[360px] border-l-2 border-[#ff8a00] flex items-center group-hover:scale-105 transition-transform">
                                        <span className="bg-white px-3 py-0.5 text-[10px] text-[#ff8a00] font-black border-2 border-[#ff8a00] rounded-full rotate-90 whitespace-nowrap absolute -right-8 shadow-sm">HEIGHT: {bodyData.find(d => d.size === selectedSize).height}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Garment Illustration */}
                            <div className="bg-gray-50/50 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden group">
                                <span className="absolute top-6 left-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Dimensions</span>
                                <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center">
                                     <svg viewBox="0 0 200 200" className="w-full h-full text-gray-200" fill="none" stroke="currentColor" strokeWidth="4">
                                        <path d="M50,40 L150,40 L175,120 L145,120 L145,170 L55,170 L55,120 L25,120 Z" />
                                    </svg>
                                    
                                    {/* Garment Measurements */}
                                    <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-28 h-[1px] border-b-2 border-dashed border-[#ff8a00] flex justify-center group-hover:scale-105 transition-transform">
                                        <span className="bg-white px-3 py-0.5 text-[10px] text-[#ff8a00] font-black border-2 border-[#ff8a00] rounded-full -top-3.5 absolute shadow-sm">SHOULDER: {productData.find(d => d.size === selectedSize).shoulder}</span>
                                    </div>
                                     <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-40 h-[1px] border-b-2 border-dashed border-[#ff8a00] flex justify-center group-hover:scale-105 transition-transform">
                                        <span className="bg-white px-3 py-0.5 text-[10px] text-[#ff8a00] font-black border-2 border-[#ff8a00] rounded-full -top-3.5 absolute shadow-sm">CHEST: {productData.find(d => d.size === selectedSize).chest}</span>
                                    </div>
                                    <div className="absolute right-0 top-[50px] h-[120px] border-l-2 border-[#ff8a00] flex items-center group-hover:scale-105 transition-transform">
                                        <span className="bg-white px-3 py-0.5 text-[10px] text-[#ff8a00] font-black border-2 border-[#ff8a00] rounded-full rotate-90 absolute -right-8 shadow-sm">LENGTH: {productData.find(d => d.size === selectedSize).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                            <Info size={18} className="text-blue-500 shrink-0" />
                            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                The data is measured manually and may have minor discrepancies. Values are in inches unless specified.
                            </p>
                        </div>

                        {/* Table Section */}
                        <div className="space-y-8 pt-6">
                            <div className="flex gap-10 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                                <button 
                                    onClick={() => setSubTab('body')}
                                    className={`text-[11px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-all whitespace-nowrap ${subTab === 'body' ? 'border-[#1A0D0D] text-[#1A0D0D]' : 'border-transparent text-gray-300'}`}
                                >
                                    Body charts
                                </button>
                                <button 
                                    onClick={() => setSubTab('product')}
                                    className={`text-[11px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-all whitespace-nowrap ${subTab === 'product' ? 'border-[#1A0D0D] text-[#1A0D0D]' : 'border-transparent text-gray-300'}`}
                                >
                                    Product chart
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                                <table className="w-full text-left border-collapse bg-white">
                                    <thead>
                                        <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">
                                            <th className="px-6 py-5 font-bold">Label Size</th>
                                            {subTab === 'body' ? (
                                                <>
                                                    <th className="px-6 py-5 font-bold">US <ChevronRight size={10} className="inline rotate-90 ml-1" /></th>
                                                    <th className="px-6 py-5 font-bold">Bust</th>
                                                    <th className="px-6 py-5 font-bold">Waist</th>
                                                    <th className="px-6 py-5 font-bold">Height</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="px-6 py-5 font-bold">Shoulder</th>
                                                    <th className="px-6 py-5 font-bold">Chest</th>
                                                    <th className="px-6 py-5 font-bold">Length</th>
                                                    <th className="px-6 py-5 font-bold">Sleeve</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="text-[12px]">
                                        {currentData.map((row) => (
                                            <tr key={row.size} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selectedSize === row.size ? 'bg-[#4C1414]/5' : ''}`}>
                                                <td className={`px-6 py-5 font-black tracking-widest ${selectedSize === row.size ? 'text-[#4C1414]' : 'text-gray-700'}`}>{row.size}</td>
                                                {subTab === 'body' ? (
                                                    <>
                                                        <td className="px-6 py-5 text-gray-600 font-medium">{row.us}</td>
                                                        <td className="px-6 py-5 text-gray-600 font-medium">{row.bust}</td>
                                                        <td className="px-6 py-5 text-gray-600 font-medium">{row.waist}</td>
                                                        <td className="px-6 py-5 text-gray-600 font-medium">{row.height}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-5 text-gray-600 font-medium">{row.shoulder}</td>
                                                        <td className="px-6 py-5 text-gray-600 font-medium">{row.chest}</td>
                                                        <td className="px-6 py-5 text-gray-600 font-medium">{row.length}</td>
                                                        <td className="px-6 py-5 text-gray-600 font-medium">{row.sleeve}</td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <Ruler size={32} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-serif font-bold">Personalized Recommendation</h2>
                        <p className="text-gray-400 text-sm max-w-sm">We're building an AI-powered size recommender. Stay tuned for updates!</p>
                        <button 
                            onClick={() => setActiveTab('guide')}
                            className="mt-6 px-8 py-3 bg-[#4C1414] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                            Back to Size Guide
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SizeGuidePage;
