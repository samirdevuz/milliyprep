# 2.5D illustratsiyalar

Bu papkaga sayt foydalanadigan **PNG fayllar**ni quying. Fayllar quyidagi aniq nomlar bilan saqlanishi kerak:

| Fayl nomi | Qaerda ishlatiladi | Tavsiya etilgan o'lchov |
|---|---|---|
| `logo.png` | Header logo, onboarding/auth side panel, dashboard | 256×256 (kvadrat, shaffof fon) |
| `checklist.png` | Onboarding side panel, Mission bo'limi | 1024×1024 (shaffof fon) |
| `notebook.png` | Auto-grading bo'limi (yon dekorativ) | 1024×1024 (shaffof fon) |
| `phone-study.png` | Auth side panel, ProductShowcase boshi | 1024×1024 (shaffof fon) |

> Eslatma: Agar fayl bo'lmasa, sayt baribir ishlaydi — har bir illustratsiya o'rnida chiroyli gradient zaxira (fallback) ko'rsatiladi.

## Tezkor qo'yish

Windows PowerShell:

```powershell
copy "C:\path\to\logo.png" public\illustrations\logo.png
copy "C:\path\to\checklist.png" public\illustrations\checklist.png
copy "C:\path\to\notebook.png" public\illustrations\notebook.png
copy "C:\path\to\phone-study.png" public\illustrations\phone-study.png
```

Yoki rasmlarni Explorer'dan to'g'ridan-to'g'ri shu papkaga sudrab tashlang.
