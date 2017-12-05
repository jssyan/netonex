#pragma once

class CTestSSLClientX
{
public:
	CTestSSLClientX(void);
	~CTestSSLClientX(void);

	void SSLclient(LPCTSTR addr, int port);
	void SSLclient2(LPCTSTR addr, int port);
	void SSLclient3(LPCTSTR addr, int port);

private:
	void SendRecv(CComPtr<NetONEX::ISSLClientX> s);
};

