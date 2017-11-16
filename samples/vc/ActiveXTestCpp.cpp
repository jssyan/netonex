// ActiveXTestCpp.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "TestNetONEX.h"

int _tmain(int argc, _TCHAR* argv[])
{
	HRESULT hr;

	hr = CoInitialize(0);
	if(SUCCEEDED(hr))
	{
		CTestNetONEX x;
		x.Run();
	}
	CoUninitialize();
	cin.get();

	return 0;
}

