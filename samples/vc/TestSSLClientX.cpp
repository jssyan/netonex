#include "stdafx.h"
#include "TestSSLClientX.h"


CTestSSLClientX::CTestSSLClientX(void)
{
}


CTestSSLClientX::~CTestSSLClientX(void)
{
}

void CTestSSLClientX::SendRecv(CComPtr<NetONEX::ISSLClientX> s) {
	NetONEX::ICertificateXPtr c = s->PeerCertificate;
	//_tprintf(_T("[0x%08x] %s\n%s\n%s\n%s\n"), GetCurrentThreadId(), (LPCTSTR)(s->Method), (LPCTSTR)c->Subject, (LPCTSTR)c->Issuer, (LPCTSTR)s->CipherInfo);

	s->WriteString(_T("GET / HTTP/1.0\r\n\r\n"));
	s->LastError = 0;
	size_t total = 0;
	while (true) {
		_variant_t r = s->ReadBytes(4096);
		if (s->LastError) {
			MSGprintf(_T("SSL read failed. (%s)"), (LPCTSTR)s->ErrorString);
			break;
		}
		ULONG size;
		BYTE* p = VAR2buffer(r, &size);
		if (!p) {
			if (s->LastError == 0) {
				_tprintf(_T("[0x%08x] all data are read.\n"), GetCurrentThreadId()); 
				break;
			}
			else {
				MSGprintf(_T("SSL read failed. (%s)"), (LPCTSTR)s->ErrorString);
				break; //failed
			}
		}
		_tprintf(_T("[0x%08x] got %d\n"), GetCurrentThreadId(), size);
		total += size;
		//cout << p << endl;  // if p contains string, we can show it here
		delete p;
	}
	_tprintf(_T("[0x%08x] total %d\n"), GetCurrentThreadId(), total);
}

void CTestSSLClientX::SSLclient(LPCTSTR addr, int port) {
	CComPtr<NetONEX::ISSLClientX> s;
	if (!SUCCEEDED(s.CoCreateInstance(__uuidof(NetONEX::SSLClientX)))) {
		MSGprintf(_T("初始化实例失败！"));
		return;
	}
	s->_DEBUG_ = 1;
	s->Method = _T("auto");
	//s->Method = _T("cncav1.1");
	s->TimeoutConnect = 15;
	s->TimeoutWrite = 5;
	s->TimeoutRead = 15;
	s->Connect(addr, port);
	if (s->Connected) {
		SendRecv(s);
		s->Shutdown();
	}
}

static SOCKET clientSocket(LPCTSTR ip, int port) {
	WORD sockVersion = MAKEWORD(2,2);  
    WSADATA data;   
    if (WSAStartup(sockVersion, &data) != 0) {  
		MSGprintf(_T("WSAStartup() failed"));
        return 0;  
    }  
  
    SOCKET sclient = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);  
    if (sclient == INVALID_SOCKET)  {  
        MSGprintf(_T("invalid socket"));  
        return 0;  
    }  
	
	CT2A ipaddr(ip);
    sockaddr_in serAddr;  
    serAddr.sin_family = AF_INET;  
    serAddr.sin_port = htons(port);  
    serAddr.sin_addr.S_un.S_addr = inet_addr((LPCSTR)ipaddr);   
    if (connect(sclient, (sockaddr *)&serAddr, sizeof(serAddr)) == SOCKET_ERROR)  
    {  
        MSGprintf(_T("connect error"));  
        closesocket(sclient);  
        return 0;  
    } 
	return sclient;
}

void CTestSSLClientX::SSLclient2(LPCTSTR addr, int port) {
	CComPtr<NetONEX::ISSLClientX> s;
	if (!SUCCEEDED(s.CoCreateInstance(__uuidof(NetONEX::SSLClientX)))) {
		MSGprintf(_T("初始化实例失败！"));
		return;
	}
	s->_DEBUG_ = 1;
	s->Method = _T("auto");
	//s->Method = _T("cncav1.1");
	cout << s->Method << endl;
	s->TimeoutConnect = 15;
	s->TimeoutWrite = 5;
	s->TimeoutRead = 15;
	SOCKET sock = clientSocket(addr, port);
	s->ConnectSocket(sock);
	if (s->Connected) {
		SendRecv(s);
		s->Shutdown();
	}
	closesocket(sock);
}

typedef struct st_thread_opt {
	CTestSSLClientX* x;
	LPCTSTR addr;
	int port;
} THREAD_OPT;

DWORD WINAPI Thread1(LPVOID pM) {
	THREAD_OPT* opt = (THREAD_OPT*)pM;
	HRESULT hr = CoInitialize(0);
	if (SUCCEEDED(hr)) {
		while (1) {
			opt->x->SSLclient(opt->addr, opt->port);
			Sleep(2000);
		}
	}
	return 0;
}

void CTestSSLClientX::SSLclient3(LPCTSTR addr, int port) {
	const int THREAD_NUM = 5;
    HANDLE handle[THREAD_NUM];  
	THREAD_OPT opt[THREAD_NUM];
    for (int i = 0; i < THREAD_NUM; i++)  {
		opt[i].x = this;
		opt[i].addr = addr;
		opt[i].port = port;
		handle[i] = (HANDLE)CreateThread(NULL, 0, Thread1, &(opt[i]), 0, NULL); 
	}
	WaitForMultipleObjects(THREAD_NUM, handle, TRUE, INFINITE);
}