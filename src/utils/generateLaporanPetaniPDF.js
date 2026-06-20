import { jsPDF } from 'jspdf';

// ── Formatters ─────────────────────────────────────────────────────────────────
const fmt = (v) => (v !== null && v !== undefined && v !== '') ? String(v) : '-';

const fmtDate = (s) => {
    if (!s) return '-';
    try {
        const d = new Date(s);
        if (isNaN(d.getTime())) return String(s);
        return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    } catch { return String(s); }
};

const fmtNum = (n) => {
    if (n === null || n === undefined || n === '') return '-';
    const num = Number(n);
    return isNaN(num) ? '-' : num.toLocaleString('id-ID');
};

const fmtBool = (v) => v ? 'Sudah' : 'Belum';

const fmtGender = (val, label) => {
    if (label) return label;
    if (val === '1' || val === 1) return 'Laki-Laki';
    if (val === '2' || val === 2) return 'Perempuan';
    return '-';
};

const fmtKeanggotaan = (val) => {
    if (val === '1' || val === 1) return 'Aktif';
    if (val === '2' || val === 2) return 'Keluar';
    if (val === '3' || val === 3) return 'Non-Aktif';
    return fmt(val);
};

const fmtRp = (n) => {
    if (n === null || n === undefined) return '-';
    return `Rp ${Number(n).toLocaleString('id-ID')}`;
};

// ── PDF Generator ──────────────────────────────────────────────────────────────
export const generateLaporanPetaniPDF = (data, namaLaporan) => {
    const {
        data_petani: p = {},
        data_kebun = [],
        data_produksi = [],
        data_pestisida = [],
        data_pupuk = [],
        data_lb3 = [],
        data_penjualan = [],
        data_pekerja = [],
        data_diklat = [],
    } = data;

    // ── Layout ─────────────────────────────────────────────────────────────────
    const PW = 210, PH = 297;
    const ML = 12, MR = 12, MT = 12, MB = 18;
    const CW = PW - ML - MR;   // 186 mm

    const ROW_H  = 5.5;
    const HDR_H  = 6.5;
    const SEC_H  = 7.5;
    const SUB_H  = 6;

    // ── Colors ─────────────────────────────────────────────────────────────────
    const C_SEC    = [45,  55,  72 ];
    const C_SUB    = [192, 86,  33 ];
    const C_TH     = [74,  85,  104];
    const C_EVEN   = [255, 255, 255];
    const C_ODD    = [247, 250, 252];
    const C_BORDER = [203, 213, 224];
    const C_WHITE  = [255, 255, 255];
    const C_DARK   = [45,  55,  72 ];
    const C_GRAY   = [113, 128, 150];
    const C_LABEL  = [100, 116, 139];
    const C_GREEN  = [39,  103, 73 ];
    const C_RED    = [155, 44,  44 ];

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    let pageNum = 1;
    let y = MT;

    const now = new Date();
    const printDate = now.toLocaleString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }) + ' WIB';

    // ── Page helpers ───────────────────────────────────────────────────────────
    const addFooter = () => {
        pdf.setDrawColor(...C_BORDER);
        pdf.setLineWidth(0.3);
        pdf.line(ML, PH - MB + 4, PW - MR, PH - MB + 4);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...C_GRAY);
        pdf.text(`Dicetak pada: ${printDate} | Sistem Informasi Petani`, ML, PH - MB + 8);
        pdf.text(`Halaman ${pageNum}`, PW - MR, PH - MB + 8, { align: 'right' });
    };

    const newPage = () => {
        addFooter();
        pdf.addPage();
        pageNum++;
        y = MT;
    };

    const check = (needed) => { if (y + needed > PH - MB) newPage(); };
    const spacer = (h = 4) => { check(h); y += h; };

    // ── Section / sub header ───────────────────────────────────────────────────
    const secHeader = (title) => {
        check(SEC_H + ROW_H * 2);
        pdf.setFillColor(...C_SEC);
        pdf.rect(ML, y, CW, SEC_H, 'F');
        pdf.setFontSize(9.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...C_WHITE);
        pdf.text(title, ML + 3, y + 5.2);
        y += SEC_H;
    };

    const subHdr = (title) => {
        check(SUB_H + ROW_H);
        pdf.setFillColor(...C_SUB);
        pdf.rect(ML, y, CW, SUB_H, 'F');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...C_WHITE);
        const lines = pdf.splitTextToSize(title, CW - 6);
        pdf.text(lines[0], ML + 3, y + 4.2);
        y += SUB_H;
    };

    // ── Info grid (3-column label/value pairs) ─────────────────────────────────
    const infoGrid = (rows) => {
        const colW   = CW / 3;
        const labelW = colW * 0.42;
        const valueW = colW * 0.58;

        rows.forEach((pairs, ri) => {
            let maxLines = 1;
            pairs.forEach(([, val]) => {
                if (val && val !== '-') {
                    const ls = pdf.splitTextToSize(String(val), valueW - 2);
                    maxLines = Math.max(maxLines, ls.length);
                }
            });
            const cellH = Math.max(ROW_H, maxLines * 3.8 + 1.5);
            check(cellH);

            pdf.setFillColor(...(ri % 2 === 0 ? C_EVEN : C_ODD));
            pdf.rect(ML, y, CW, cellH, 'F');
            pdf.setDrawColor(...C_BORDER);
            pdf.setLineWidth(0.2);
            pdf.rect(ML, y, CW, cellH, 'S');
            pdf.line(ML + colW,     y, ML + colW,     y + cellH);
            pdf.line(ML + colW * 2, y, ML + colW * 2, y + cellH);

            pairs.forEach(([label, value], ci) => {
                const xBase = ML + colW * ci;
                if (label) {
                    pdf.setFontSize(7);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(...C_LABEL);
                    pdf.text(String(label), xBase + 1.5, y + 3.8);
                }
                if (value) {
                    pdf.setFontSize(7.5);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(...C_DARK);
                    const ls = pdf.splitTextToSize(String(value), valueW - 2);
                    ls.forEach((line, li) => {
                        pdf.text(line, xBase + labelW + 0.5, y + 3.8 + li * 3.8);
                    });
                }
            });
            y += cellH;
        });
    };

    // ── Generic table ──────────────────────────────────────────────────────────
    const drawTable = (headers, rows, colWidths, fontSize = 7.5) => {
        const total = colWidths.reduce((a, b) => a + b, 0);
        const scale = total > CW ? CW / total : 1;
        const widths = colWidths.map(w => w * scale);
        const tableW = widths.reduce((a, b) => a + b, 0);

        // Header row
        check(HDR_H + ROW_H);
        pdf.setFillColor(...C_TH);
        pdf.rect(ML, y, tableW, HDR_H, 'F');
        pdf.setFontSize(fontSize - 0.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...C_WHITE);
        let x = ML;
        headers.forEach((h, i) => {
            const ls = pdf.splitTextToSize(String(h), widths[i] - 2);
            pdf.text(ls[0], x + 1.5, y + 4.5);
            x += widths[i];
        });
        y += HDR_H;

        if (!rows.length) { noData(); return; }

        rows.forEach((row, ri) => {
            // Calculate row height for text wrapping
            let maxLines = 1;
            row.forEach((cell, i) => {
                const ls = pdf.splitTextToSize(String(cell ?? '-'), widths[i] - 3);
                maxLines = Math.max(maxLines, ls.length);
            });
            const cellH = Math.max(ROW_H, maxLines * 3.8 + 1.5);
            check(cellH);

            pdf.setFillColor(...(ri % 2 === 0 ? C_EVEN : C_ODD));
            pdf.rect(ML, y, tableW, cellH, 'F');
            pdf.setDrawColor(...C_BORDER);
            pdf.setLineWidth(0.2);
            pdf.rect(ML, y, tableW, cellH, 'S');

            pdf.setFontSize(fontSize);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(...C_DARK);
            x = ML;
            row.forEach((cell, i) => {
                if (i > 0) { pdf.setDrawColor(...C_BORDER); pdf.line(x, y, x, y + cellH); }
                const ls = pdf.splitTextToSize(String(cell ?? '-'), widths[i] - 3);
                ls.forEach((line, li) => pdf.text(line, x + 1.5, y + 3.8 + li * 3.8));
                x += widths[i];
            });
            y += cellH;
        });
    };

    // ── No data placeholder ────────────────────────────────────────────────────
    const noData = (msg = 'Tidak ada data') => {
        check(ROW_H);
        pdf.setFillColor(249, 250, 251);
        pdf.rect(ML, y, CW, ROW_H, 'F');
        pdf.setDrawColor(...C_BORDER);
        pdf.setLineWidth(0.2);
        pdf.rect(ML, y, CW, ROW_H, 'S');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(...C_GRAY);
        pdf.text(msg, ML + CW / 2, y + 3.8, { align: 'center' });
        y += ROW_H;
    };

    // ════════════════════════════════════════════════════════════════════════════
    // HEADER
    // ════════════════════════════════════════════════════════════════════════════
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...C_DARK);
    pdf.setFontSize(16);
    pdf.text('SISTEM INFORMASI PETANI', PW / 2, y + 7, { align: 'center' });
    y += 11;

    pdf.setFontSize(12);
    pdf.text('LAPORAN PROFIL PETANI', PW / 2, y + 5, { align: 'center' });
    y += 8;

    pdf.setFontSize(14);
    pdf.setTextColor(...C_SUB);
    pdf.text((p.nama || 'N/A').toUpperCase(), PW / 2, y + 5, { align: 'center' });
    y += 8;

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...C_GRAY);
    pdf.text(`ID Petani: ${fmt(p.id_petani)} | Kelompok: ${fmt(p.nama_kelompok)}`, PW / 2, y + 3, { align: 'center' });
    y += 5;
    pdf.text(`Dicetak pada: ${printDate}`, PW / 2, y + 3, { align: 'center' });
    y += 6;

    pdf.setDrawColor(...C_SEC);
    pdf.setLineWidth(0.5);
    pdf.line(ML, y, PW - MR, y);
    y += 5;

    // ════════════════════════════════════════════════════════════════════════════
    // 1. IDENTITAS PETANI
    // ════════════════════════════════════════════════════════════════════════════
    secHeader('1. IDENTITAS PETANI');
    infoGrid([
        [['Id Petani', fmt(p.id_petani)],       ['Nama Petani', fmt(p.nama)],                ['Jenis Kelamin', fmtGender(p.jns_kelamin, p.jns_kelamin_label)]],
        [['Kelompok Tani', fmt(p.nama_kelompok)],['Status Keanggotaan', fmtKeanggotaan(p.keanggotaan)], ['Tanggal Bergabung', fmtDate(p.tanggal_bergabung)]],
        [['Tanggal Keluar', fmtDate(p.tanggal_keluar)], ['Status Pernikahan', fmt(p.status_perkawinan_label)], ['Pendidikan', fmt(p.pendidikan_terakhir_label)]],
        [['No. WhatsApp', fmt(p.no_wa)],         ['Tempat Lahir', fmt(p.tempat)],             ['Tanggal Lahir', fmtDate(p.tanggal_lahir)]],
        [['No. KTP', fmt(p.no_ktp)],             ['No. KK', fmt(p.no_kk)],                   ['No. NIB', fmt(p.no_nib)]],
        [['Provinsi', fmt(p.provinsi_nama)],     ['Kabupaten/Kota', fmt(p.kabupaten_nama)],   ['Kecamatan', fmt(p.kecamatan_nama)]],
        [['Desa', fmt(p.desa_nama)],             ['Alamat Lengkap', fmt(p.alamat)],           ['', '']],
    ]);
    spacer();

    // ════════════════════════════════════════════════════════════════════════════
    // 2. DATA KEBUN
    // ════════════════════════════════════════════════════════════════════════════
    secHeader(`2. DATA KEBUN (${data_kebun.length} Kebun)`);
    if (!data_kebun.length) {
        noData('Tidak ada data kebun');
    } else {
        data_kebun.forEach((k, idx) => {
            const prod = data_produksi.find(pr => pr.kebun_id === k.id);
            subHdr(`Kebun ${idx + 1} — ${fmt(k.id_kebun)}`);
            infoGrid([
                [['Id Kebun', fmt(k.id_kebun)],       ['Petani Pemilik', fmt(k.nama_petani)],   ['Kelompok Tani', fmt(k.kelompok_tani)]],
                [['Lokasi Kebun', fmt(k.lokasi_kebun)],['Luas Kebun', k.luas_kebun ? `${fmtNum(k.luas_kebun)} Ha` : '-'], ['Luas Peta', k.luas_peta ? `${fmtNum(parseFloat(k.luas_peta))} Ha` : '-']],
                [['Waktu Tanam', fmt(k.waktu_tanam)], ['Komoditas', fmt(k.komoditas) !== '-' ? fmt(k.komoditas) : 'Kelapa Sawit'], ['Pola Tanam', fmt(k.pola_tanam)]],
                [['Jenis Lahan', fmt(k.jenis_lahan)], ['Jumlah Pohon', fmtNum(k.jumlah_pohon)],['Tahun Peremajaan', fmt(k.tahun_peremajaan)]],
                [['Asal Benih', fmt(k.asal_benih)],   ['Jenis Pupuk', fmt(k.jenis_pupuk)],     ['Mitra Penjualan', fmt(k.mitra_penjualan)]],
                [['RSPO', fmtBool(k.is_rspo)],        ['ISPO', fmtBool(k.is_ispo)],            ['Jenis Legalitas', fmt(k.jenis_legalitas_label)]],
                [['No. Legalitas', fmt(k.nomor_legalitas)], ['Pemilik Legalitas', fmt(k.pemilik_legalitas)], ['No. STDB', fmt(k.nomor_stdb)]],
                [['Total Produksi', prod?.total_produksi ? `${fmtNum(prod.total_produksi)} Kg/Tahun` : '-'], ['', ''], ['', '']],
            ]);
        });
    }
    spacer();

    // ════════════════════════════════════════════════════════════════════════════
    // 3. DATA PRODUKSI
    // ════════════════════════════════════════════════════════════════════════════
    secHeader('3. DATA PRODUKSI');
    if (!data_produksi.length) {
        noData('Tidak ada data produksi');
    } else {
        data_produksi.forEach(pr => {
            subHdr(`Kebun: ${fmt(pr.id_kebun)} | Total: ${fmtNum(pr.total_produksi)} Kg | Produktivitas: ${fmtNum(pr.prod_ha_th)} Ton/Ha/Th | Umur: ${fmtNum(pr.umur_tanaman)} Tahun`);
            if (pr.detail_bulanan?.length) {
                const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
                drawTable(
                    ['Tahun', ...months, 'Total (Kg)'],
                    pr.detail_bulanan.map(row => [
                        fmt(row.tahun),
                        ...[1,2,3,4,5,6,7,8,9,10,11,12].map(m => fmtNum(row[`bulan_${m}`] ?? row[`m${m}`] ?? 0)),
                        fmtNum(row.total),
                    ]),
                    [14,13,13,13,13,13,13,13,13,13,13,13,13,18],
                    6.5
                );
            } else {
                drawTable(
                    ['Total Produksi (Kg)','Produktivitas (Ton/Ha/Th)','Luas Kebun (Ha)','Umur Tanaman (Th)','Tahun Tanam'],
                    [[fmtNum(pr.total_produksi), fmtNum(pr.prod_ha_th), fmtNum(parseFloat(pr.luas_kebun||0)), fmtNum(pr.umur_tanaman), fmt(pr.tahun_tanam)]],
                    [42, 42, 34, 34, 34]
                );
            }
        });
    }
    spacer();

    // ════════════════════════════════════════════════════════════════════════════
    // 4. PENGGUNAAN PESTISIDA
    // ════════════════════════════════════════════════════════════════════════════
    secHeader('4. PENGGUNAAN PESTISIDA (GAP)');
    if (!data_pestisida.length) {
        noData('Tidak ada data pestisida');
    } else {
        data_pestisida.forEach(ps => {
            subHdr(`Kebun: ${fmt(ps.id_kebun)} | Total Pestisida: ${fmtNum(ps.total_pestisida)} Liter`);
            if (ps.detail_semester?.length) {
                drawTable(
                    ['Tahun','Semester','Sistemik — Waktu','Sistemik — Jumlah','Kontak — Waktu','Kontak — Jumlah'],
                    ps.detail_semester.map(row => [
                        fmt(row.tahun), fmt(row.semester),
                        fmt(row.sistemik_waktu),
                        row.sistemik_jumlah != null ? `${fmtNum(row.sistemik_jumlah)} Liter` : '-',
                        fmt(row.kontak_waktu),
                        row.kontak_jumlah != null ? `${fmtNum(row.kontak_jumlah)} Liter` : '-',
                    ]),
                    [20,20,40,36,36,34]
                );
            } else {
                drawTable(
                    ['Total Pestisida (Liter)','Luas Kebun (Ha)','Umur Tanaman (Th)'],
                    [[fmtNum(ps.total_pestisida), fmtNum(parseFloat(ps.luas_kebun||0)), fmtNum(ps.umur_tanaman)]],
                    [62,62,62]
                );
            }
        });
    }
    spacer();

    // ════════════════════════════════════════════════════════════════════════════
    // 5. PENGGUNAAN PUPUK
    // ════════════════════════════════════════════════════════════════════════════
    secHeader('5. PENGGUNAAN PUPUK (GAP)');
    if (!data_pupuk.length) {
        noData('Tidak ada data pupuk');
    } else {
        data_pupuk.forEach(pu => {
            subHdr(`Kebun: ${fmt(pu.id_kebun)} | Total Pupuk: ${fmtNum(pu.total_pupuk)} Kg | Jumlah Pokok: ${fmtNum(pu.jumlah_pokok)}`);
            if (pu.detail_semester?.length) {
                drawTable(
                    ['Thn','Sem','NPK Wkt','NPK Jml','N Wkt','N Jml','P Wkt','P Jml','K Wkt','K Jml','B Wkt','B Jml','Mg Wkt','Mg Jml'],
                    pu.detail_semester.map(row => [
                        fmt(row.tahun), fmt(row.semester),
                        fmt(row.npk_waktu), row.npk_jumlah != null ? `${fmtNum(row.npk_jumlah)} Kg` : '-',
                        fmt(row.n_waktu),   row.n_jumlah   != null ? `${fmtNum(row.n_jumlah)} Kg`   : '-',
                        fmt(row.p_waktu),   row.p_jumlah   != null ? `${fmtNum(row.p_jumlah)} Kg`   : '-',
                        fmt(row.k_waktu),   row.k_jumlah   != null ? `${fmtNum(row.k_jumlah)} Kg`   : '-',
                        fmt(row.b_waktu),   row.b_jumlah   != null ? `${fmtNum(row.b_jumlah)} Kg`   : '-',
                        fmt(row.mg_waktu),  row.mg_jumlah  != null ? `${fmtNum(row.mg_jumlah)} Kg`  : '-',
                    ]),
                    [12,12,14,16,14,16,14,16,14,16,14,16,14,16],
                    6.5
                );
            } else {
                drawTable(
                    ['Total Pupuk (Kg)','Jumlah Pokok','Luas Kebun (Ha)','Umur Tanaman (Th)'],
                    [[fmtNum(pu.total_pupuk), fmtNum(pu.jumlah_pokok), fmtNum(parseFloat(pu.luas_kebun||0)), fmtNum(pu.umur_tanaman)]],
                    [46,46,47,47]
                );
            }
        });
    }
    spacer();

    // ════════════════════════════════════════════════════════════════════════════
    // 6. LIMBAH B3
    // ════════════════════════════════════════════════════════════════════════════
    secHeader('6. LIMBAH B3 (LB3)');
    if (!data_lb3.length) {
        noData('Tidak ada data LB3');
    } else {
        data_lb3.forEach(lb => {
            subHdr(`Kebun: ${fmt(lb.id_kebun)} | Total LB3: ${fmtNum(lb.total_lb3)} Kg`);
            if (lb.detail_tahun?.length) {
                drawTable(
                    ['Tahun','Limbah Botol','Limbah Jeriken','Limbah Karung Pupuk'],
                    lb.detail_tahun.map(row => [
                        fmt(row.tahun),
                        row.botol        != null ? `${fmtNum(row.botol)} Kg`        : '-',
                        row.jeriken      != null ? `${fmtNum(row.jeriken)} Kg`      : '-',
                        row.karung_pupuk != null ? `${fmtNum(row.karung_pupuk)} Kg` : '-',
                    ]),
                    [30,52,52,52]
                );
            } else {
                drawTable(
                    ['Total LB3 (Kg)','Luas Kebun (Ha)','Umur Tanaman (Th)'],
                    [[fmtNum(lb.total_lb3), fmtNum(parseFloat(lb.luas_kebun||0)), fmtNum(lb.umur_tanaman)]],
                    [62,62,62]
                );
            }
        });
    }
    spacer();

    // ════════════════════════════════════════════════════════════════════════════
    // 7. DATA PENJUALAN
    // ════════════════════════════════════════════════════════════════════════════
    secHeader(`7. DATA PENJUALAN (${data_penjualan.length} Transaksi)`);
    if (!data_penjualan.length) {
        noData('Tidak ada data penjualan');
    } else {
        const totalPj = data_penjualan.reduce((s, r) => s + (Number(r.total_penjualan) || 0), 0);
        drawTable(
            ['Tanggal','No. Registrasi','Kelompok','Driver','No. Polisi','Jml Tandan','Berat Bersih','Harga/Kg','Total Penjualan','Pabrik'],
            [
                ...data_penjualan.map(pj => [
                    fmtDate(pj.tanggal), fmt(pj.no_registrasi), fmt(pj.kelompok),
                    fmt(pj.driver), fmt(pj.no_polisi), fmtNum(pj.jml_tandan),
                    pj.berat_bersih ? `${fmtNum(pj.berat_bersih)} Kg` : '-',
                    fmtRp(pj.harga_per_kg), fmtRp(pj.total_penjualan), fmt(pj.pabrik),
                ]),
                ['','','','','','','','TOTAL', fmtRp(totalPj),''],
            ],
            [20,30,26,18,18,16,18,16,24,20],
            6.5
        );
    }
    spacer();

    // ════════════════════════════════════════════════════════════════════════════
    // 8. DATA PEKERJA
    // ════════════════════════════════════════════════════════════════════════════
    secHeader(`8. DATA PEKERJA (${data_pekerja.length} Orang)`);
    if (!data_pekerja.length) {
        noData('Tidak ada data pekerja');
    } else {
        drawTable(
            ['Nama','Jenis Kelamin','Status','Umur','Jenis Pekerjaan','APD yang Digunakan'],
            data_pekerja.map(w => [
                fmt(w.nama), fmtGender(w.jenis_kelamin, null), fmt(w.status),
                w.umur ? `${w.umur} Tahun` : '-',
                fmt(w.jenis_pekerjaan), fmt(w.apd),
            ]),
            [30,24,20,16,40,56]
        );
    }
    spacer();

    // ════════════════════════════════════════════════════════════════════════════
    // 9. DIKLAT
    // ════════════════════════════════════════════════════════════════════════════
    secHeader('9. DIKLAT (PELATIHAN)');
    if (!data_diklat.length) {
        noData('Tidak ada data diklat');
    } else {
        const d = data_diklat[0];
        const fields = [
            ['SL',               d.sl],
            ['P&C (RSPO/ISPO)',  d.pandc ?? d.p_and_c ?? d.pc],
            ['Pestisida',        d.pestisida],
            ['K3',               d.k3],
            ['SOP',              d.sop],
            ['PDG/FDG',          d.pdg_fdg ?? d.pdgfdg],
        ];
        const colW = CW / fields.length;

        // Header row
        check(HDR_H + ROW_H);
        pdf.setFillColor(...C_TH);
        pdf.rect(ML, y, CW, HDR_H, 'F');
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...C_WHITE);
        fields.forEach(([label], i) => {
            pdf.text(label, ML + colW * i + colW / 2, y + 4.5, { align: 'center' });
        });
        y += HDR_H;

        // Value row
        check(ROW_H);
        pdf.setFillColor(...C_EVEN);
        pdf.rect(ML, y, CW, ROW_H, 'F');
        pdf.setDrawColor(...C_BORDER);
        pdf.setLineWidth(0.2);
        pdf.rect(ML, y, CW, ROW_H, 'S');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');

        fields.forEach(([, val], i) => {
            if (i > 0) { pdf.setDrawColor(...C_BORDER); pdf.line(ML + colW * i, y, ML + colW * i, y + ROW_H); }
            pdf.setTextColor(...(val ? C_GREEN : C_RED));
            pdf.text(fmtBool(val), ML + colW * i + colW / 2, y + 3.8, { align: 'center' });
        });
        y += ROW_H;
    }

    // Final footer on last page
    addFooter();

    pdf.save(`${namaLaporan || 'Laporan Petani'}.pdf`);
};
