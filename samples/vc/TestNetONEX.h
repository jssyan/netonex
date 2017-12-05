#pragma once

class CTestNetONEX
{
public:
	CTestNetONEX(void);
	~CTestNetONEX(void);

	void Base64X();
	void XMLsign();
	void TSA(LPCTSTR addr, int port);
	void Crt();
	void Run();

protected:
	BYTE* VAR2buffer(variant_t v, ULONG* size);

private:
	CComPtr<NetONEX::IMainX> m_pMainX;
};

