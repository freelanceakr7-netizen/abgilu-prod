import React, { useState, useEffect } from 'react';
import {
  getHeroSettings,
  saveHeroSettings,
  getBannerSettings,
  saveBannerSettings,
  getLogoSettings,
  saveLogoSettings,
  DEFAULT_HERO,
  DEFAULT_BANNERS,
} from '../../firebase/services/storefrontService';
import { fileToBase64, resizeImageBase64 } from '../../utils/imageUtils';
import { Upload, Image as ImageIcon, Check, Loader2 } from 'lucide-react';

const Field = ({ label, type = 'text', value, onChange, hint }) => (
  <div className="mb-4">
    <label className="block text-[10px] uppercase font-black tracking-widest text-indigo/40 mb-2 ml-1">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors resize-none font-medium"
      />
    ) : (
      <div className="flex items-center gap-3">
        <div className="relative flex-grow">
          <input
            type={type === 'color' ? 'text' : type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={type === 'color' ? '#000000 or rgba(...)' : ''}
            className="w-full px-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo font-mono focus:outline-none focus:border-indigo transition-colors"
          />
        </div>
        {type === 'color' && (
          <div 
            className="w-11 h-11 rounded-none border border-indigo/20 shadow-sm flex-shrink-0 relative overflow-hidden group"
            style={{ backgroundColor: value || 'transparent' }}
            title={value}
          >
            <input 
              type="color" 
              value={value?.startsWith('#') ? value : '#000000'} 
              onChange={e => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        )}
      </div>
    )}
    {hint && <p className="text-[10px] text-indigo/20 font-bold uppercase tracking-widest mt-1.5 ml-1">{hint}</p>}
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden mb-8">
    <div className="px-8 py-5 border-b border-indigo/10 bg-kora-light flex items-center gap-4">
      <div className="w-1 h-4 bg-[#4C0E0E] rounded-none" />
      <h3 className="text-[11px] uppercase font-black tracking-[0.2em] text-indigo">
        {title}
      </h3>
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const HeroEditor = () => {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroMobileImageFile, setHeroMobileImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHeroSettings().then(data => { setHero(data); setLoading(false); });
  }, []);

  const set = (key, val) => setHero(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveHeroSettings(hero, heroImageFile, heroMobileImageFile);
      setSaved(true);
      setHeroImageFile(null);
      setHeroMobileImageFile(null);
      const data = await getHeroSettings();
      setHero(data);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Error saving:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      const preview = URL.createObjectURL(file);
      set('bgImage', preview);
    }
  };

  const handleMobileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroMobileImageFile(file);
      const preview = URL.createObjectURL(file);
      set('bgImageMobile', preview);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-3 py-10 justify-center">
      <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-indigo"></div>
      <span className="text-[10px] uppercase font-black tracking-widest text-indigo/20">Syncing Hero Data...</span>
    </div>
  );

  return (
    <SectionCard title="Slide 01: Master Hero">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <Field
          label="Primary Heading"
          type="textarea"
          value={hero.heading}
          onChange={v => set('heading', v)}
          hint="Use '\\n' for controlled breaks"
        />
        <Field
          label="Accent Sub-text"
          value={hero.subText}
          onChange={v => set('subText', v)}
        />
        <Field
          label="Action Prompt (Button)"
          value={hero.btnLabel}
          onChange={v => set('btnLabel', v)}
        />
        <Field
          label="Navigation Path"
          value={hero.btnLink}
          onChange={v => set('btnLink', v)}
        />
        <div className="md:col-span-2 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Field
                label="Visual Source - Desktop (Image URL)"
                value={hero.bgImage}
                onChange={v => set('bgImage', v)}
              />
              <div className="flex items-center gap-4 mb-8 -mt-2">
                <label className="flex items-center gap-2.5 px-6 py-2.5 bg-indigo/5 border border-indigo/10 rounded-none cursor-pointer hover:bg-indigo/10 transition-colors group">
                  <Upload size={14} className="text-indigo/40 group-hover:text-indigo transition-colors" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo/60 group-hover:text-indigo">
                    {heroImageFile ? 'Replace Desktop Asset' : 'Upload Desktop Asset'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {heroImageFile && <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1"><Check size={12} /> Pending Flush</span>}
              </div>
            </div>
            
            <div>
              <Field
                label="Visual Source - Mobile (Image URL)"
                value={hero.bgImageMobile || ''}
                onChange={v => set('bgImageMobile', v)}
              />
              <div className="flex items-center gap-4 mb-8 -mt-2">
                <label className="flex items-center gap-2.5 px-6 py-2.5 bg-indigo/5 border border-indigo/10 rounded-none cursor-pointer hover:bg-indigo/10 transition-colors group">
                  <Upload size={14} className="text-indigo/40 group-hover:text-indigo transition-colors" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo/60 group-hover:text-indigo">
                    {heroMobileImageFile ? 'Replace Mobile Asset' : 'Upload Mobile Asset'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleMobileFileChange} className="hidden" />
                </label>
                {heroMobileImageFile && <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1"><Check size={12} /> Pending Flush</span>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-indigo/5 pt-8">
          <Field label="Atmosphere (BG)" type="color" value={hero.bgColor} onChange={v => set('bgColor', v)} />
          <Field label="Header Tone" type="color" value={hero.headingColor} onChange={v => set('headingColor', v)} />
          <Field label="Subtitle Tone" type="color" value={hero.subColor} onChange={v => set('subColor', v)} />
        </div>
      </div>

      <div className="relative h-64 rounded-none overflow-hidden bg-kora-light border border-indigo/10 group">
        <div 
          className="absolute inset-0 bg-cover bg-top transition-transform duration-1000 group-hover:scale-105"
          style={{ 
            backgroundColor: hero.bgColor,
            backgroundImage: hero.bgImage ? `url(${hero.bgImage})` : 'none',
          }} 
        />
        {/* Dark overlay removed for full brightness */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
          <h4 className="text-white font-black text-4xl mb-2 tracking-tight leading-tight whitespace-pre-line" style={{ color: hero.headingColor || '#FFFFFF' }}>
            {hero.heading}
          </h4>
          <p className="text-[10px] uppercase font-black tracking-[0.3em] mb-6 opacity-80" style={{ color: hero.subColor || '#FFFFFF' }}>
            {hero.subText}
          </p>
          <div className="border-b border-white pb-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-white">
              {hero.btnLabel}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`mt-8 w-full md:w-auto px-10 py-4 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${
          saved 
            ? 'bg-green-600 text-white' 
            : 'bg-[#4C0E0E] text-white hover:bg-terracotta shadow-maroon/20 hover:-translate-y-0.5'
        }`}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
        {saving ? 'Processing...' : saved ? 'Committed!' : 'Flush Hero Updates'}
      </button>
    </SectionCard>
  );
};

const BannerEditor = () => {
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBannerSettings().then(data => { setBanners(data); setLoading(false); });
  }, []);

  const set = (key, val) =>
    setBanners(prev => prev.map((b, i) => i === active ? { ...b, [key]: val } : b));

  const handleBannerFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        const resized = await resizeImageBase64(base64, 1200, 800, 0.7);
        set('bgImage', resized);
      } catch (err) {
        console.error('Error processing banner image:', err);
      }
    }
  };

  const handleBannerMobileFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        const resized = await resizeImageBase64(base64, 768, 1280, 0.7);
        set('bgImageMobile', resized);
      } catch (err) {
        console.error('Error processing mobile banner image:', err);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBannerSettings(banners);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Error saving:', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const b = banners[active];

  return (
    <SectionCard title="Sticky Stack Layers (02 - 04)">
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 custom-scrollbar">
        {banners.map((ban, i) => (
          <button
            key={ban.id}
            onClick={() => setActive(i)}
            className={`px-8 py-2.5 rounded-none font-black text-[10px] uppercase tracking-widest transition-all border whitespace-nowrap ${
              active === i 
                ? 'bg-[#4C0E0E] text-white border-[#4C0E0E] shadow-lg shadow-maroon/10' 
                : 'bg-kora-light text-indigo/60 border-indigo/10 hover:border-indigo/30'
            }`}
          >
            Layer 0{i + 2}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <Field label="Visual Heading" value={b.heading} onChange={v => set('heading', v)} />
        <Field label="Context Sub-text" value={b.subText} onChange={v => set('subText', v)} />
        <Field label="Call-to-Action Text" value={b.btnLabel} onChange={v => set('btnLabel', v)} />
        <Field label="Target Path" value={b.btnLink} onChange={v => set('btnLink', v)} />
        <div className="md:col-span-2 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Field
                label="Visual Source - Desktop (Image URL)"
                value={b.bgImage}
                onChange={v => set('bgImage', v)}
              />
              <div className="flex items-center gap-4 mb-8 -mt-2">
                <label className="flex items-center gap-2.5 px-6 py-2.5 bg-indigo/5 border border-indigo/10 rounded-none cursor-pointer hover:bg-indigo/10 transition-colors group">
                  <Upload size={14} className="text-indigo/40 group-hover:text-indigo transition-colors" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo/60 group-hover:text-indigo">
                    Upload Desktop Layer
                  </span>
                  <input type="file" accept="image/*" onChange={handleBannerFileChange} className="hidden" />
                </label>
              </div>
            </div>
            
            <div>
              <Field
                label="Visual Source - Mobile (Image URL)"
                value={b.bgImageMobile || ''}
                onChange={v => set('bgImageMobile', v)}
              />
              <div className="flex items-center gap-4 mb-8 -mt-2">
                <label className="flex items-center gap-2.5 px-6 py-2.5 bg-indigo/5 border border-indigo/10 rounded-none cursor-pointer hover:bg-indigo/10 transition-colors group">
                  <Upload size={14} className="text-indigo/40 group-hover:text-indigo transition-colors" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo/60 group-hover:text-indigo">
                    Upload Mobile Layer
                  </span>
                  <input type="file" accept="image/*" onChange={handleBannerMobileFileChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-indigo/5 pt-8">
          <Field label="Atmosphere" type="color" value={b.bgColor} onChange={v => set('bgColor', v)} />
          <Field label="Header Tone" type="color" value={b.headingColor} onChange={v => set('headingColor', v)} />
          <Field label="Subtitle Tone" type="color" value={b.subColor} onChange={v => set('subColor', v)} />
          <Field label="Button Text" type="color" value={b.btnTextColor} onChange={v => set('btnTextColor', v)} />
          <Field label="Button Outline" type="color" value={b.btnBorderColor} onChange={v => set('btnBorderColor', v)} />
        </div>
      </div>

      <div className="relative h-64 rounded-none overflow-hidden bg-kora-light border border-indigo/10 mt-8 group">
        <div 
          className="absolute inset-0 bg-cover bg-top transition-transform duration-1000 group-hover:scale-105"
          style={{ 
            backgroundColor: b.bgColor,
            backgroundImage: b.bgImage ? `url(${b.bgImage})` : 'none',
          }} 
        />
        {/* Dark overlay removed for full brightness */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
          <h4 className="text-white font-black text-5xl mb-2 tracking-tighter" style={{ color: b.headingColor || '#FFFFFF' }}>
            {b.heading}
          </h4>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] mb-10 opacity-80" style={{ color: b.subColor || '#FFFFFF' }}>
            {b.subText}
          </p>
          <div 
            className="px-10 py-3 border-2 text-[10px] uppercase font-black tracking-[0.2em]"
            style={{ 
              borderColor: b.btnBorderColor || 'white', 
              color: b.btnTextColor || 'white' 
            }}
          >
            {b.btnLabel}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`mt-10 w-full md:w-auto px-10 py-4 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${
          saved 
            ? 'bg-green-600 text-white' 
            : 'bg-[#4C0E0E] text-white hover:bg-terracotta shadow-maroon/20 hover:-translate-y-0.5'
        }`}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
        {saving ? 'Processing...' : saved ? 'Committed!' : 'Flush All Layer Updates'}
      </button>
    </SectionCard>
  );
};

const LogoEditor = () => {
  const [logo, setLogo] = useState({ imageUrl: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogoSettings().then(data => { setLogo(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveLogoSettings(logo, logoFile);
      setSaved(true);
      setLogoFile(null);
      const data = await getLogoSettings();
      setLogo(data);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Error saving logo:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const preview = URL.createObjectURL(file);
      setLogo({ imageUrl: preview });
    }
  };

  if (loading) return null;

  return (
    <SectionCard title="Brand Identity (Logo)">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <div className="md:col-span-2 mt-4">
          <Field
            label="Logo URL"
            value={logo.imageUrl}
            onChange={v => setLogo({ imageUrl: v })}
          />
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2.5 px-6 py-2.5 bg-indigo/5 border border-indigo/10 rounded-none cursor-pointer hover:bg-indigo/10 transition-colors group">
              <Upload size={14} className="text-indigo/40 group-hover:text-indigo transition-colors" />
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo/60 group-hover:text-indigo">
                {logoFile ? 'Replace Logo' : 'Upload Logo'}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {logoFile && <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1"><Check size={12} /> Pending Flush</span>}
          </div>
          
          {/* Logo Preview */}
          {logo.imageUrl && (
            <div className="mt-6 p-6 bg-gray-100 flex items-center justify-center border border-indigo/10">
              <img src={logo.imageUrl} alt="Brand Logo Preview" className="max-h-16 object-contain" />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`mt-8 w-full md:w-auto px-10 py-4 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${
          saved 
            ? 'bg-green-600 text-white' 
            : 'bg-[#4C0E0E] text-white hover:bg-terracotta shadow-maroon/20 hover:-translate-y-0.5'
        }`}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
        {saving ? 'Processing...' : saved ? 'Committed!' : 'Flush Logo Updates'}
      </button>
    </SectionCard>
  );
};

const StorefrontManagement = () => (
  <div className="max-w-4xl mx-auto py-2">
    <div className="flex items-center gap-4 mb-10 bg-indigo/5 p-6 border-l-4 border-[#4C0E0E] rounded-none">
      <ImageIcon className="text-indigo/40" size={24} />
      <p className="text-[11px] font-bold text-indigo/60 uppercase tracking-widest leading-relaxed">
        Real-time storefront visualization controls. Adjust the geometry, atmosphere, and identity of your master hero and parallax stacking layers. 
        <span className="block text-[#4C0E0E] mt-1 font-black opacity-60">Changes manifest instantly across production environments upon commitment.</span>
      </p>
    </div>
    
    <div className="space-y-4">
      <LogoEditor />
      <HeroEditor />
      <BannerEditor />
    </div>
  </div>
);

export default StorefrontManagement;


