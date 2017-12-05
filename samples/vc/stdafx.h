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

#pragma comment(lib, "Ws2_32.lib")

// 这里请设置到NetONEX.dll的路径
#import "h:/project/windows/x86/Release/NetONEX.dll" rename("DEBUG", "_DEBUG_")

#define MSGprintf(str,...) do { \
	ATL::CString __dbuf; \
	__dbuf.Format(_T("%s(%d): [0x%08x] ") str, (LPCTSTR)CA2T(__FUNCTION__), __LINE__, GetCurrentThreadId(), __VA_ARGS__); \
	::MessageBox(NULL, __dbuf, _T("NetONEX TEST"), MB_OK); \
} while (0)


static BYTE* VAR2buffer(variant_t v, ULONG* size) {
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