#pragma once

// 这里请设置到NetONEX.dll的路径
#import "h:/project/windows/x86/Release/NetONEX.dll" rename("DEBUG", "_DEBUG_")

class CTestNetONEX
{
public:
	CTestNetONEX(void);
	~CTestNetONEX(void);

	void Base64X();
	void SSLclient(LPCTSTR addr, int port);
	void SSLclient2(LPCTSTR addr, int port);
	void XMLsign();
	void TSA(LPCTSTR addr, int port);
	void Crt();
	void Run();

protected:
	BYTE* VAR2buffer(variant_t v, ULONG* size);

private:
	NetONEX::IMainXPtr m_pMainX;
};

