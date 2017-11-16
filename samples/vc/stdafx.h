// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently, but
// are changed infrequently
//

#pragma once

#include "targetver.h"

#include <stdio.h>
#include <tchar.h>


#define _ATL_CSTRING_EXPLICIT_CONSTRUCTORS      // some CString constructors will be explicit

#include <atlbase.h>
#include <atlstr.h>
#include <atlconv.h>
#include <atlsafe.h>

#include <iostream>
using namespace std;

#define MSGprintf(str,...) do { \
	ATL::CString __dbuf; \
	__dbuf.Format(_T("%s(%d): ") str, (LPCTSTR)CA2T(__FUNCTION__), __LINE__, __VA_ARGS__); \
	::MessageBox(NULL, __dbuf, _T("NetONEX TEST"), MB_OK); \
} while (0)
