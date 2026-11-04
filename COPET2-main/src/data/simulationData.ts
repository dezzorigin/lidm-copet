export interface SimulationChoice {
  text: string;
  idText: string;
  nextNodeId: string | null;
  result: 'safe' | 'scam' | 'neutral';
  feedback?: string;
}

export interface SimulationNode {
  id: string;
  message: string;
  idMessage: string;
  sender: string;
  choices: SimulationChoice[];
}

export const simulationBranch: Record<string, SimulationNode> = {
  'start': {
    id: 'start',
    sender: 'Kurir J&T Express (+62 821-4321-9876)',
    message: 'Excuse me, is this Kak Agent? I am a J&T Express courier. There is a large package for you here.',
    idMessage: 'Permisi, apa benar ini dengan Kak Agent? Saya kurir J&T Express. Ada paket besar untuk Kakak di sini.',
    choices: [
      {
        text: 'Yes, that is me. What package? I do not remember ordering anything.',
        idText: 'Iya benar, saya sendiri. Paket apa ya? Saya tidak merasa pesan barang.',
        nextNodeId: 'node_2',
        result: 'neutral'
      },
      {
        text: 'I did not order any package. This is a scam. I am blocking this number immediately!',
        idText: 'Saya tidak memesan paket apapun. Ini modus penipuan. Saya blokir nomor ini sekarang!',
        nextNodeId: null,
        result: 'safe',
        feedback: 'Good ending! Unsolicited messages about COD packages from unknown numbers are common baiting strategies. Blocking them instantly keeps you safe from further engineering. / Good Ending! Pesan tiba-tiba tentang kiriman COD dari nomor tak dikenal adalah pancingan umum. Memblokir mereka seketika membuat Anda tetap aman dari rekayasa sosial.'
      }
    ]
  },
  'node_2': {
    id: 'node_2',
    sender: 'Kurir J&T Express (+62 821-4321-9876)',
    message: 'According to the receipt, it is an electronic item from Shopee. The COD amount is Rp 450,000. To check, I will send you a photo of the package.',
    idMessage: 'Menurut resinya, ini barang elektronik dari Shopee. Tagihan COD sebesar Rp 450.000. Untuk memastikan, saya kirimkan foto paketnya ya.',
    choices: [
      {
        text: 'COD? Send the photo first so I can verify the package details.',
        idText: 'COD? Kirim fotonya dulu biar saya pastikan isi paketnya.',
        nextNodeId: 'node_3',
        result: 'neutral'
      },
      {
        text: 'I never buy items via COD. Please return the package to the sender.',
        idText: 'Saya tidak pernah beli barang sistem COD. Tolong kembalikan saja paketnya ke penjual.',
        nextNodeId: 'node_2b',
        result: 'neutral'
      }
    ]
  },
  'node_2b': {
    id: 'node_2b',
    sender: 'Kurir J&T Express (+62 821-4321-9876)',
    message: 'But if you cancel it unilaterally, your Shopee account might be suspended by the system for violating COD rules. Please check the receipt photo and item details first.',
    idMessage: 'Tapi kalau kakak cancel sepihak, akun Shopee kakak bisa dinonaktifkan oleh sistem karena melanggar aturan COD. Tolong cek dulu foto resi dan barangnya kak.',
    choices: [
      {
        text: 'Really? Okay, send the photo so I can see it.',
        idText: 'Masa sih? Ya sudah, tolong kirim fotonya biar saya cek.',
        nextNodeId: 'node_3',
        result: 'neutral'
      },
      {
        text: 'I do not care if my account is suspended. This sounds fake. I am blocking you now!',
        idText: 'Saya tidak peduli akun diblokir. Ini terdengar mencurigakan. Saya blokir nomor Anda!',
        nextNodeId: null,
        result: 'safe',
        feedback: 'Good ending! Scammers use the threat of account suspension (Urgency & Fear tactic) to force you into taking action. Rejecting and blocking is the safest path. / Good Ending! Penipu menggunakan ancaman penangguhan akun (taktik urgensi & ketakutan) untuk memaksa Anda bertindak. Menolak dan memblokir adalah jalur teraman.'
      }
    ]
  },
  'node_3': {
    id: 'node_3',
    sender: 'Kurir J&T Express (+62 821-4321-9876)',
    message: 'Here is the document containing the package photo and receipt details. Please download and install it to view the image: [Lihat_Foto_Paket.apk] (Size: 5.4 MB)',
    idMessage: 'Ini file foto rincian paket & resinya kak, silakan di-download dan di-install untuk melihat foto paketnya: [Lihat_Foto_Paket.apk] (Ukuran: 5.4 MB)',
    choices: [
      {
        text: 'Why is the format .apk? Photos are usually .jpg or .png. This is suspicious.',
        idText: 'Kenapa formatnya .apk? Bukankah foto biasanya berekstensi .jpg atau .png? Ini aneh.',
        nextNodeId: 'node_4',
        result: 'neutral'
      },
      {
        text: 'Alright, I will download and open it now.',
        idText: 'Baik, saya download dan buka sekarang.',
        nextNodeId: null,
        result: 'scam',
        feedback: 'Bad Ending! You installed a malicious .apk file. This is a credential stealer/SMS grabber malware. It will intercept your banking OTPs and drain your accounts! / Bad Ending! Anda menginstal file .apk berbahaya. Ini adalah malware pencuri data (credential stealer/SMS grabber) yang akan mencegat SMS OTP bank Anda dan menguras rekening Anda!'
      },
      {
        text: 'This is an application file (.apk), not a photo! You are trying to hack me. Blocked!',
        idText: 'Ini file aplikasi (.apk), bukan foto! Anda mencoba meretas saya. Blokir!',
        nextNodeId: null,
        result: 'safe',
        feedback: 'Good Ending! You successfully spotted the .apk extension trick. Real couriers send pictures directly in JPEG/PNG formats. Installing an APK from personal chat is a major security risk. / Good Ending! Anda berhasil mendeteksi trik ekstensi .apk. Kurir asli mengirimkan gambar langsung dalam format JPEG/PNG. Menginstal APK dari chat pribadi adalah risiko keamanan besar.'
      }
    ]
  },
  'node_4': {
    id: 'node_4',
    sender: 'Kurir J&T Express (+62 821-4321-9876)',
    message: 'Yes kak, because the package is large, the receipt detail and courier GPS tracking are combined in our official J&T Express Tracker application so you can monitor my position live.',
    idMessage: 'Iya kak, karena paketnya besar, rincian resi dan GPS kurir digabung dalam aplikasi J&T Express Tracker resmi kami biar kakak bisa pantau posisi saya sekarang.',
    choices: [
      {
        text: 'GPS Tracker? That sounds weird. Just send a screenshot of your screen.',
        idText: 'Pelacak GPS? Terdengar aneh. Kirim tangkapan layar (screenshot) saja.',
        nextNodeId: 'node_5',
        result: 'neutral'
      },
      {
        text: 'Ah, I see. Let me install it then.',
        idText: 'Oh begitu. Biar saya install dulu aplikasinya.',
        nextNodeId: null,
        result: 'scam',
        feedback: 'Bad Ending! You fell for the tracking app excuse. The application you installed will intercept your SMS messages and send your banking login credentials to the hacker. / Bad Ending! Anda percaya alasan aplikasi pelacak. Aplikasi yang Anda pasang akan membaca SMS Anda dan mengirimkan kredensial mobile banking Anda ke peretas.'
      },
      {
        text: 'Official apps are only installed from the Google Play Store, never via WhatsApp chat. I am blocking you!',
        idText: 'Aplikasi resmi hanya di-install dari Google Play Store, bukan lewat chat WhatsApp. Saya blokir!',
        nextNodeId: null,
        result: 'safe',
        feedback: 'Good Ending! Excellent analysis. Real companies will never distribute mobile applications via personal chat links or file transfers. / Good Ending! Analisis yang luar biasa. Perusahaan resmi tidak pernah mendistribusikan aplikasi seluler melalui tautan chat pribadi atau transfer file.'
      }
    ]
  },
  'node_5': {
    id: 'node_5',
    sender: 'Kurir J&T Express (+62 821-4321-9876)',
    message: 'My phone is very old kak and can\'t take screenshots, memory is full. This is for your package safety, if you don\'t install it the delivery status will fail and you will get a Shopee fine.',
    idMessage: 'Hp saya jadul kak gak bisa screenshot layar, memori penuh. Ini demi keselamatan paket kakak juga, kalau tidak diinstall nanti statusnya gagal kirim dan kakak kena denda Shopee.',
    choices: [
      {
        text: 'A fine? How much is the fine? I do not want to be fined.',
        idText: 'Kena denda? Berapa dendanya? Saya tidak mau kena denda.',
        nextNodeId: 'node_6',
        result: 'neutral'
      },
      {
        text: 'Fine, I will install the app so the delivery goes through safely.',
        idText: 'Yasudah, saya install saja aplikasinya biar paket terkirim aman.',
        nextNodeId: null,
        result: 'scam',
        feedback: 'Bad Ending! You installed the Trojan. The hacker now has full control over your SMS inbox, allowing them to access your mobile banking accounts. / Bad Ending! Anda menginstal aplikasi Trojan tersebut. Peretas sekarang memiliki akses penuh atas kotak masuk SMS Anda, mempermudah mereka menembus akun perbankan Anda.'
      },
      {
        text: 'Your excuse makes no sense. Real couriers don\'t demand app installs. I am blocking you!',
        idText: 'Alasan Anda tidak masuk akal. Kurir asli tidak memaksa pasang aplikasi. Saya blokir!',
        nextNodeId: null,
        result: 'safe',
        feedback: 'Good Ending! You saw through the urgency trap. Scammers construct elaborate stories and excuses to scare you into executing their payload. Good job blocking. / Good Ending! Anda melihat melalui jebakan urgensi. Penipu membuat cerita dan alasan rumit untuk menakut-nakuti Anda agar memasang aplikasi mereka.'
      }
    ]
  },
  'node_6': {
    id: 'node_6',
    sender: 'Kurir J&T Express (+62 821-4321-9876)',
    message: 'The fine is Rp 500,000 kak, automatically debited from ShopeePay or your connected e-wallet. Please install the app quickly, while I am still near your home.',
    idMessage: 'Dendanya Rp 500.000 kak, didebet otomatis dari ShopeePay atau e-wallet kakak yang terhubung. Tolong buruan kak diinstall aplikasinya, mumpung saya masih dekat rumah kakak.',
    choices: [
      {
        text: 'Oh no, my e-wallet balance will be lost! I\'ll install it immediately to avoid the fine.',
        idText: 'Aduh, saldo e-wallet saya bisa hilang! Saya install sekarang saja demi menghindari denda.',
        nextNodeId: null,
        result: 'scam',
        feedback: 'Bad Ending! Saldo terkuras habis dan handphone Anda terinfeksi malware pencuri OTP. Penipu berhasil mengakses ShopeePay dan rekening bank Anda secara penuh. / Bad Ending! Your balance was completely drained and your phone was infected with OTP stealing malware. The scammer has full control over your accounts.'
      },
      {
        text: 'I know this is a phishing APK scam! Real e-wallets don\'t debit random fines. Blocking!',
        idText: 'Saya tahu ini modus penipuan APK! E-wallet asli tidak mendebet denda sembarangan. Blokir!',
        nextNodeId: null,
        result: 'safe',
        feedback: 'Good Ending! Anda berhasil mendeteksi penipuan siber. Anda menyadari e-wallet tidak akan pernah mendebet denda dari chat kurir. Anda menyelamatkan keuangan Anda! / Good Ending! You successfully detected cyber fraud. You realized e-wallets would never debit random fines from courier chats. You saved your finances!'
      }
    ]
  }
};
