#include "stdafx.h"
#include "TestNetONEX.h"

using namespace NetONEX;

CTestNetONEX::CTestNetONEX(void)
{
	m_pMainX = NULL;
	HRESULT hr;

	hr = m_pMainX.CreateInstance(__uuidof(NetONEX::MainX));
	if (!SUCCEEDED(hr))
	{
		MSGprintf(_T("初始化实例失败！"));
		exit(-1);
	}
}


CTestNetONEX::~CTestNetONEX(void)
{
	//if (m_pMainX) {
	//	m_pMainX->Release();
	//}
}

void CTestNetONEX::Base64X() {
	IBase64XPtr pBase64X = NULL;
	pBase64X = m_pMainX->CreateBase64XInstance();
	BSTR b64(_T("1tDOxGFiY2Q="));
	BSTR out;
	out = pBase64X->DecodeHexString(b64);
	ATL::CString x(out);
	MSGprintf(_T("结果：%s"), x);
}

void CTestNetONEX::XMLsign() {
	ICertificateCollectionXPtr p = NULL;
	ICertificateXPtr x = NULL;

	p = m_pMainX->CreateCertificateCollectionXInstance();
	p->Load();
	x = p->SelectCertificateDialog();
	if (x) {
		BSTR out(_T("111111"));
		//MSGprintf(_T("\n%d"), x->VerifyPIN(out));
		MSGprintf(_T("\n%d"), x->VerifyPIN(_T("111112")));
		out = x->XMLSign(_T("<root><a>test</a></root>"));
		MSGprintf(_T("\n%s"), out);
	}
}

void CTestNetONEX::TSA(LPCTSTR addr, int port) {
	NetONEX::ITSAClientXPtr h = m_pMainX->CreateTSAClientXInstance();
	// 设置时间戳服务器地址
	h->ServerAddress = addr;
	// 设置时间戳服务器端口
	h->ServerPort = port;
	// 如果需要打开debug状态, uncomment the next line
	// h->_DEBUG_ = 1;

	// 创建时间戳
	// 如果待签名的是字符串，可以直接使用下面这行来构造v
	// CComVariant v("abc")

	// 如果待签名数据是一个内存块，例如是个unsigned char*， 可以使用下面的代码来构造v
	unsigned char t[] = { 0x01, 0x02, 0x00, 0x03 };
	CComSafeArray<unsigned char> a;
	a.Add(4, t, TRUE);
	CComVariant v(a);

	NetONEX::ITSAResponseXPtr resp = h->TSACreate(&v);
	if (resp) {
		cout << "BASE64编码的时间戳结果: " << endl;
		cout << (LPCSTR)CT2A(resp->ToBASE64()) << endl;

		// 也可以获取时间戳的属性信息
		cout << (LPCSTR)CT2A(resp->Imprint) << endl;
		cout << resp->Timestamp << endl;

		//验证时间戳, 以base64编码的时间戳作为参数
		long n = h->TSAVerify(resp->ToBASE64());
		MSGprintf(_T("result: %d. verify %s"), n, (n == 200) ? _T("OK") : _T("FAILED"));
	}
	else {
		MSGprintf(_T("create tsa failed."));
	}
}

void CTestNetONEX::Crt() {
	NetONEX::ICertificateCollectionXPtr crtlist = m_pMainX->CreateCertificateCollectionXInstance();
	crtlist->CryptoInterface = 3; // 同时支持CSP和SM2
	crtlist->Load();
	// crtlist->Size里面是当前系统中符合条件的证书个数 （缺省条件是带私钥，支持签名）
	cout << crtlist->Size << endl;
	if (crtlist->Size == 0) {
		cout << "no certificate found, exit" << endl;
		return;
	}
	NetONEX::ICertificateXPtr crt;
	if (crtlist->Size == 1) { // 只有一个符合条件的证书，直接选择这张证书
		crt = crtlist->GetAt(0);
	}
	else {
		// 使用证书选择对话框来让用户选择证书
		crt = crtlist->SelectCertificateDialog();
		if (!crt) {
			cout << "no certificate is selected, exit" << endl;
			return;
		}
	}
	// 显示证书信息
	cout << "Friendly Name: " << crt->FriendlyName << endl; //FriendlyName项
	cout << "SerialNumber: " << crt->SerialNumber << endl; //序列号，16进制表示
	cout << "ThumbprintSHA1: " << crt->ThumbprintSHA1 << endl; //指纹，sha1方式表示
	cout << "Content: " << crt->Content << endl; //证书本身，base64编码方式表示
	// 还有很多可以显示的内容，不一一列举了

	// 到svs服务器上去验证证书有效性
	NetONEX::ISVSClientXPtr svsx = m_pMainX->CreateSVSClientXInstance();
	svsx->ServerAddress = _T("192.168.161.161");
	if (200 == svsx->SVSVerifyCertificate(crt->Content)) {
		cout << "valid certificate" << endl;
	}
	else {
		cout << "invalid certificate" << endl;
	}

	//用选中的证书做一次pkcs1的签名
	CComBSTR origdata("abc");
	//crt->Quiet = 1;
	BSTR sigb64 = crt->PKCS1String(origdata.m_str);
	if (SysStringLen(sigb64) == 0) {
		cout << "create pkcs1 failed" << endl;
		return;
	}
	cout << sigb64 << endl;

	NetONEX::IBase64XPtr b64x = m_pMainX->CreateBase64XInstance();
	//如果前面使用了PKCS1Bytes，由于返回的签名是二进制格式，因此如果要送到SVS验签，就需要把二进制的签名转换成base64编码格式的string
	//_bstr_t sigb64 = b64x->EncodeBytes(sig); 

	//把签名送到SVS服务器上去验签
	_bstr_t origdatab64 = b64x->EncodeString(origdata.m_str); //原文必须先经过base64编码
	if (200 == svsx->SVSVerifyPKCS1(crt->Content, sigb64, origdatab64)) {
		cout << "verify ok" << endl;
	}
	else {
		cout << "verify failed" << endl;
	}

	//下面演示一下如何从证书序列号找到对应的NetONEX::ICertificateXPtr对象
	BSTR s0 = crt->SerialNumber;
	crtlist->Load();
	for (int n = 0; n < crtlist->Size; n ++) {
		NetONEX::ICertificateXPtr x = crtlist->GetAt(n);
		if (x) {
			BSTR s1 = x->SerialNumber;
			if (_tcscmp(s1, s0) == 0) {
				cout << "found! pos=" << n << endl;
				break;
			}
		}
	}
}

BYTE* CTestNetONEX::VAR2buffer(variant_t v, ULONG* size) {
	*size = 0;
	if (v.vt == VT_EMPTY || v.vt == VT_NULL) {
		return NULL;
	}
	if ((v.vt & VT_ARRAY) && (v.vt & VT_I4)) {
		*size = v.parray->rgsabound->cElements;
		BYTE* r = new BYTE[*size + 1];
		CopyMemory(r, v.parray->pvData, *size);
		r[*size] = '\0'; // put a '\0' in the end for convenient print as string
		return r;
	}
	return NULL;
}

void CTestNetONEX::SSLclient(LPCTSTR addr, int port) {
	NetONEX::ISSLClientXPtr s = m_pMainX->CreateSSLClientXInstance();
	s->_DEBUG_ = 1;
	s->Method = _T("auto");
	//s->Method = _T("cncav1.1");
	cout << s->Method << endl;
	s->TimeoutConnect = 15;
	s->TimeoutWrite = 5;
	s->TimeoutRead = 15;
	s->Connect(addr, port);
	if (s->Connected) {
		NetONEX::ICertificateXPtr c = s->PeerCertificate;
		cout << c->Subject << endl;
		cout << c->Issuer << endl;
		//_tcprintf(_T("%s\n"), s->CipherInfo);
		cout << s->CipherInfo << endl;
		s->WriteString(_T("GET / HTTP/1.0\r\n\r\n"));
		s->LastError = 0;
		while (true) {
			_variant_t r = s->ReadBytes(4096);
			if (s->LastError) {
				MSGprintf(_T("SSL read failed. (%s)"), s->ErrorString);
				break;
			}
			ULONG size;
			BYTE* p = VAR2buffer(r, &size);
			if (!p) {
				if (s->LastError == 0) {
					cout << "all data are read" << endl;
					break;
				}
				else {
					cout << s->ErrorString << endl;
					break; //failed
				}
			}
			cout << size << endl;
			cout << p << endl;  // if p contains string, we can show it here
			delete p;
		}
		s->Shutdown();
	}
}

void CTestNetONEX::Run() {
	SSLclient(_T("www.baidu.com"), 443);
}