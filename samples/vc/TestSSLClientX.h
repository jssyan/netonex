#pragma once

class CTestSSLClientX
{
public:
	CTestSSLClientX(void);
	~CTestSSLClientX(void);

	/* 单向SSL，Connect() */
	void SSLclient(LPCTSTR addr, int port);
	/* 单向SSL，ConnectSocket() */
	void SSLclient2(LPCTSTR addr, int port);
	/* 单向SSL，Connect(), 多线程 */
	void SSLclient3(LPCTSTR addr, int port);
	void SSLclient3Thread(CComPtr<NetONEX::ISSLClientX> s, LPCTSTR addr, int port);
	/* 双向SSL */
	void SSLclient4(LPCTSTR addr, int port);

private:
	void SendRecv(CComPtr<NetONEX::ISSLClientX> s);
	HANDLE m_hMutex;
};

