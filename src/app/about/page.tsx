'use client';

import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import i18n from '@/i18n/config';

export default function AboutPage() {
  const { t } = useTranslation('common');
  const lang = i18n.language || 'vi';

    const values = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="m12 14 4-4-4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>,
            title: lang === 'vi' ? 'Hiệu năng tối ưu' : 'Performance First',
            desc: lang === 'vi' ? 'Tối ưu hóa từ mã nguồn đến hiệu suất.' : 'Optimizing from source to performance.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>,
            title: lang === 'vi' ? 'Giải pháp toàn diện' : 'Full-stack Solutions',
            desc: lang === 'vi' ? 'Làm chủ hệ thống và dữ liệu.' : 'Mastering System and Data.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>,
            title: lang === 'vi' ? 'Mã nguồn sạch' : 'Clean Code',
            desc: lang === 'vi' ? 'Bảo mật và mở rộng theo tiêu chuẩn quốc tế.' : 'Security and scalability by international standards.'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
            title: lang === 'vi' ? 'Đồng hành tin cậy' : 'Reliable Partner',
            desc: lang === 'vi' ? 'Chúng tôi hiện thực hóa mọi ý tưởng kinh doanh.' : 'We realize every business idea.'
        }
    ];

    const contactIcons = {
        address: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
        email: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
        phone: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    };

  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />
        {/* Hero - Giữ gradient navy đặc trưng cho cả 2 chế độ nhưng điều chỉnh độ sáng */}
        <section className="pt-32 pb-20 px-4 text-center"
                 style={{ background: 'linear-gradient(135deg, var(--navy), #16213e)' }}>
            <div className="max-w-3xl mx-auto animate-fade-in">
                <h1 className="text-5xl font-black text-white mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    RTShop
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed opacity-80">
                    {lang === 'vi'
                        ? 'Nhà cung cấp dịch vụ lập trình chuyên nghiệp.'
                        : 'Professional application development service provider.'}
                </p>
            </div>
        </section>
        {/* Mission */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="section-title text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                        {t('about.mission_title')}
                    </h2>
                    <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                        {lang === 'vi'
                            ? 'RTS tập trung xây dựng các hệ thống phần mềm có hiệu năng cao, khả năng mở rộng linh hoạt và trải nghiệm người dùng tinh tế.'
                            : 'RTS focuses on building high-performance software systems with flexible scalability and refined user experiences.'}
                    </p>
                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {lang === 'vi'
                            ? 'Với kinh nghiệm thực chiến trong việc triển khai các hệ thống phức tạp, chúng tôi cam kết giải pháp kỹ thuật tối ưu nhất.'
                            : 'With practical experience in deploying complex systems, we commit to the most optimal technical solutions.'}
                    </p>
                </div>
                <div className="bg-[#0f172a] p-8 rounded-2xl border border-blue-500/20 shadow-xl font-mono text-sm">
                    <p className="text-blue-400">{'// Our Philosophy'}</p>
                    <p className="text-white"><span className="text-pink-500">const</span> rts_workflow = {'{'}</p>

                    <p className="pl-4 text-gray-400">
                        focus: <span className="text-yellow-500">"High Performance"</span>,
                    </p>
                    <p className="pl-4 text-gray-400">
                        standard: <span className="text-yellow-500">"Clean & Scalable"</span>,
                    </p>
                    <p className="pl-4 text-gray-400">
                        security: <span className="text-yellow-500">"Top Priority"</span>,
                    </p>
                    <p className="pl-4 text-gray-400">
                        support: <span className="text-yellow-500">"Long-term Partner"</span>
                    </p>

                    <p className="text-white">{'}'};</p>

                    {/* Dòng kết luận mang tính hành động */}
                    <p className="text-pink-500 mt-6 italic">
                        <span className="text-blue-400">while</span> (business.needsUpdate()) {'{'}
                    </p>
                    <p className="pl-4 text-white">RTS.provideSolution(your_idea);</p>
                    <p className="text-pink-500">{'}'}</p>
                </div>
            </div>
        </section>
        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="section-title" style={{ color: 'var(--text)' }}>
                        {lang === 'vi' ? 'Giá trị cốt lõi' : 'Our Core Values'}
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v, i) => (
                        <div key={i} className="group p-8 rounded-2xl transition-all duration-300 border border-transparent shadow-sm hover:shadow-md"
                             style={{ background: 'var(--bg)', border: '1px solid var(--border-color, rgba(0,0,0,0.05))' }}>
                            <div className="mb-6 inline-block p-3 rounded-lg bg-gray-500/5 group-hover:bg-blue-500/10 transition-colors">
                                {v.icon}
                            </div>
                            <h3 className="font-bold mb-2 text-lg" style={{ color: 'var(--text)' }}>{v.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        {/* Contact */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="section-title" style={{ color: 'var(--text)' }}>{t('about.contact')}</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
                {[
                    { key: 'address', label: t('about.address'), value: 'Hà Nội, Việt Nam' },
                    { key: 'email', label: t('about.email'), value: 'dev@trucla.id.vn' },
                    { key: 'phone', label: t('about.phone'), value: '0988 715 180' },
                ].map(item => (
                    <div key={item.key} className="flex flex-col items-center p-8 rounded-2xl transition-all shadow-sm border"
                         style={{ background: 'var(--bg)', borderColor: 'var(--border-color, rgba(0,0,0,0.1))' }}>
                        <div className="mb-4 p-3 rounded-full text-blue-500" style={{ background: 'var(--bg-secondary)' }}>
                            {contactIcons[item.key]}
                        </div>
                        <p className="font-bold mb-1 uppercase text-xs tracking-tighter opacity-50" style={{ color: 'var(--text)' }}>
                            {item.label}
                        </p>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
      <Footer />
    </div>
  );
}