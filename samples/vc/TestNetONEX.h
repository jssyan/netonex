#pragma once

// 这里请设置到NetONEX.dll的路径
#import "../../../windows/x86/Release/NetONEX.dll" rename("DEBUG", "_DEBUG_")

class CTestNetONEX
{
public:
	CTestNetONEX(void);
	~CTestNetONEX(void);

	void Base64X();

private:
	NetONEX::IMainXPtr m_pMainX;
};

