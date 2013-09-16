var cabin = cabin || {};
cabin.data = cabin.data || {};

cabin.data.collations = {
	armscii8_bin: { value: 'armscii8_bin', title: 'Armenian, Binary' }, 
	armscii8_general_ci: { value: 'armscii8_general_ci', title: 'Armenian, case-insensitive' }, 
	ascii_bin: { value: 'ascii_bin', title: 'West European (multilingual), Binary' }, 
	ascii_general_ci: { value: 'ascii_general_ci', title: 'West European (multilingual), case-insensitive' }, 
	big5_bin: { value: 'big5_bin', title: 'Traditional Chinese, Binary' }, 
	big5_chinese_ci: { value: 'big5_chinese_ci', title: 'Traditional Chinese, case-insensitive' }, 
	binary: { value: 'binary', title: 'Binary' }, 
	cp1250_bin: { value: 'cp1250_bin', title: 'Central European (multilingual), Binary' }, 
	cp1250_croatian_ci: { value: 'cp1250_croatian_ci', title: 'Croatian, case-insensitive' }, 
	cp1250_czech_cs: { value: 'cp1250_czech_cs', title: 'Czech, case-sensitive' }, 
	cp1250_general_ci: { value: 'cp1250_general_ci', title: 'Central European (multilingual), case-insensitive' }, 
	cp1250_polish_ci: { value: 'cp1250_polish_ci', title: 'Polish, case-insensitive' }, 
	cp1251_bin: { value: 'cp1251_bin', title: 'Cyrillic (multilingual), Binary' }, 
	cp1251_bulgarian_ci: { value: 'cp1251_bulgarian_ci', title: 'Bulgarian, case-insensitive' }, 
	cp1251_general_ci: { value: 'cp1251_general_ci', title: 'Cyrillic (multilingual), case-insensitive' }, 
	cp1251_general_cs: { value: 'cp1251_general_cs', title: 'Cyrillic (multilingual), case-sensitive' }, 
	cp1251_ukrainian_ci: { value: 'cp1251_ukrainian_ci', title: 'Ukrainian, case-insensitive' }, 
	cp1256_bin: { value: 'cp1256_bin', title: 'Arabic, Binary' }, 
	cp1256_general_ci: { value: 'cp1256_general_ci', title: 'Arabic, case-insensitive' }, 
	cp1257_bin: { value: 'cp1257_bin', title: 'Baltic (multilingual), Binary' }, 
	cp1257_general_ci: { value: 'cp1257_general_ci', title: 'Baltic (multilingual), case-insensitive' }, 
	cp1257_lithuanian_ci: { value: 'cp1257_lithuanian_ci', title: 'Lithuanian, case-insensitive' }, 
	cp850_bin: { value: 'cp850_bin', title: 'West European (multilingual), Binary' }, 
	cp850_general_ci: { value: 'cp850_general_ci', title: 'West European (multilingual), case-insensitive' }, 
	cp852_bin: { value: 'cp852_bin', title: 'Central European (multilingual), Binary' }, 
	cp852_general_ci: { value: 'cp852_general_ci', title: 'Central European (multilingual), case-insensitive' }, 
	cp866_bin: { value: 'cp866_bin', title: 'Russian, Binary' }, 
	cp866_general_ci: { value: 'cp866_general_ci', title: 'Russian, case-insensitive' }, 
	cp932_bin: { value: 'cp932_bin', title: 'Japanese, Binary' }, 
	cp932_japanese_ci: { value: 'cp932_japanese_ci', title: 'Japanese, case-insensitive' }, 
	dec8_bin: { value: 'dec8_bin', title: 'West European (multilingual), Binary' }, 
	dec8_swedish_ci: { value: 'dec8_swedish_ci', title: 'Swedish, case-insensitive' }, 
	eucjpms_bin: { value: 'eucjpms_bin', title: 'Japanese, Binary' }, 
	eucjpms_japanese_ci: { value: 'eucjpms_japanese_ci', title: 'Japanese, case-insensitive' }, 
	euckr_bin: { value: 'euckr_bin', title: 'Korean, Binary' }, 
	euckr_korean_ci: { value: 'euckr_korean_ci', title: 'Korean, case-insensitive' }, 
	gb2312_bin: { value: 'gb2312_bin', title: 'Simplified Chinese, Binary' }, 
	gb2312_chinese_ci: { value: 'gb2312_chinese_ci', title: 'Simplified Chinese, case-insensitive' }, 
	gbk_bin: { value: 'gbk_bin', title: 'Simplified Chinese, Binary' }, 
	gbk_chinese_ci: { value: 'gbk_chinese_ci', title: 'Simplified Chinese, case-insensitive' }, 
	geostd8_bin: { value: 'geostd8_bin', title: 'Georgian, Binary' }, 
	geostd8_general_ci: { value: 'geostd8_general_ci', title: 'Georgian, case-insensitive' }, 
	greek_bin: { value: 'greek_bin', title: 'Greek, Binary' }, 
	greek_general_ci: { value: 'greek_general_ci', title: 'Greek, case-insensitive' }, 
	hebrew_bin: { value: 'hebrew_bin', title: 'Hebrew, Binary' }, 
	hebrew_general_ci: { value: 'hebrew_general_ci', title: 'Hebrew, case-insensitive' }, 
	hp8_bin: { value: 'hp8_bin', title: 'West European (multilingual), Binary' }, 
	hp8_english_ci: { value: 'hp8_english_ci', title: 'English, case-insensitive' }, 
	keybcs2_bin: { value: 'keybcs2_bin', title: 'Czech-Slovak, Binary' }, 
	keybcs2_general_ci: { value: 'keybcs2_general_ci', title: 'Czech-Slovak, case-insensitive' }, 
	koi8r_bin: { value: 'koi8r_bin', title: 'Russian, Binary' }, 
	koi8r_general_ci: { value: 'koi8r_general_ci', title: 'Russian, case-insensitive' }, 
	koi8u_bin: { value: 'koi8u_bin', title: 'Ukrainian, Binary' }, 
	koi8u_general_ci: { value: 'koi8u_general_ci', title: 'Ukrainian, case-insensitive' }, 
	latin1_bin: { value: 'latin1_bin', title: 'West European (multilingual), Binary' }, 
	latin1_danish_ci: { value: 'latin1_danish_ci', title: 'Danish, case-insensitive' }, 
	latin1_general_ci: { value: 'latin1_general_ci', title: 'West European (multilingual), case-insensitive' }, 
	latin1_general_cs: { value: 'latin1_general_cs', title: 'West European (multilingual), case-sensitive' }, 
	latin1_german1_ci: { value: 'latin1_german1_ci', title: 'German (dictionary), case-insensitive' }, 
	latin1_german2_ci: { value: 'latin1_german2_ci', title: 'German (phone book), case-insensitive' }, 
	latin1_spanish_ci: { value: 'latin1_spanish_ci', title: 'Spanish, case-insensitive' }, 
	latin1_swedish_ci: { value: 'latin1_swedish_ci', title: 'Swedish, case-insensitive' }, 
	latin2_bin: { value: 'latin2_bin', title: 'Central European (multilingual), Binary' }, 
	latin2_croatian_ci: { value: 'latin2_croatian_ci', title: 'Croatian, case-insensitive' }, 
	latin2_czech_cs: { value: 'latin2_czech_cs', title: 'Czech, case-sensitive' }, 
	latin2_general_ci: { value: 'latin2_general_ci', title: 'Central European (multilingual), case-insensitive' }, 
	latin2_hungarian_ci: { value: 'latin2_hungarian_ci', title: 'Hungarian, case-insensitive' }, 
	latin5_bin: { value: 'latin5_bin', title: 'Turkish, Binary' }, 
	latin5_turkish_ci: { value: 'latin5_turkish_ci', title: 'Turkish, case-insensitive' }, 
	latin7_bin: { value: 'latin7_bin', title: 'Baltic (multilingual), Binary' }, 
	latin7_estonian_cs: { value: 'latin7_estonian_cs', title: 'Estonian, case-sensitive' }, 
	latin7_general_ci: { value: 'latin7_general_ci', title: 'Baltic (multilingual), case-insensitive' }, 
	latin7_general_cs: { value: 'latin7_general_cs', title: 'Baltic (multilingual), case-sensitive' }, 
	macce_bin: { value: 'macce_bin', title: 'Central European (multilingual), Binary' }, 
	macce_general_ci: { value: 'macce_general_ci', title: 'Central European (multilingual), case-insensitive' }, 
	macroman_bin: { value: 'macroman_bin', title: 'West European (multilingual), Binary' }, 
	macroman_general_ci: { value: 'macroman_general_ci', title: 'West European (multilingual), case-insensitive' }, 
	sjis_bin: { value: 'sjis_bin', title: 'Japanese, Binary' }, 
	sjis_japanese_ci: { value: 'sjis_japanese_ci', title: 'Japanese, case-insensitive' }, 
	swe7_bin: { value: 'swe7_bin', title: 'Swedish, Binary' }, 
	swe7_swedish_ci: { value: 'swe7_swedish_ci', title: 'Swedish, case-insensitive' }, 
	tis620_bin: { value: 'tis620_bin', title: 'Thai, Binary' }, 
	tis620_thai_ci: { value: 'tis620_thai_ci', title: 'Thai, case-insensitive' }, 
	ucs2_bin: { value: 'ucs2_bin', title: 'Unicode (multilingual), Binary' }, 
	ucs2_czech_ci: { value: 'ucs2_czech_ci', title: 'Czech, case-insensitive' }, 
	ucs2_danish_ci: { value: 'ucs2_danish_ci', title: 'Danish, case-insensitive' }, 
	ucs2_esperanto_ci: { value: 'ucs2_esperanto_ci', title: 'Esperanto, case-insensitive' }, 
	ucs2_estonian_ci: { value: 'ucs2_estonian_ci', title: 'Estonian, case-insensitive' }, 
	ucs2_general_ci: { value: 'ucs2_general_ci', title: 'Unicode (multilingual), case-insensitive' }, 
	ucs2_hungarian_ci: { value: 'ucs2_hungarian_ci', title: 'Hungarian, case-insensitive' }, 
	ucs2_icelandic_ci: { value: 'ucs2_icelandic_ci', title: 'Icelandic, case-insensitive' }, 
	ucs2_latvian_ci: { value: 'ucs2_latvian_ci', title: 'Latvian, case-insensitive' }, 
	ucs2_lithuanian_ci: { value: 'ucs2_lithuanian_ci', title: 'Lithuanian, case-insensitive' }, 
	ucs2_persian_ci: { value: 'ucs2_persian_ci', title: 'Persian, case-insensitive' }, 
	ucs2_polish_ci: { value: 'ucs2_polish_ci', title: 'Polish, case-insensitive' }, 
	ucs2_roman_ci: { value: 'ucs2_roman_ci', title: 'West European, case-insensitive' }, 
	ucs2_romanian_ci: { value: 'ucs2_romanian_ci', title: 'Romanian, case-insensitive' }, 
	ucs2_slovak_ci: { value: 'ucs2_slovak_ci', title: 'Slovak, case-insensitive' }, 
	ucs2_slovenian_ci: { value: 'ucs2_slovenian_ci', title: 'Slovenian, case-insensitive' }, 
	ucs2_spanish2_ci: { value: 'ucs2_spanish2_ci', title: 'Traditional Spanish, case-insensitive' }, 
	ucs2_spanish_ci: { value: 'ucs2_spanish_ci', title: 'Spanish, case-insensitive' }, 
	ucs2_swedish_ci: { value: 'ucs2_swedish_ci', title: 'Swedish, case-insensitive' }, 
	ucs2_turkish_ci: { value: 'ucs2_turkish_ci', title: 'Turkish, case-insensitive' }, 
	ucs2_unicode_ci: { value: 'ucs2_unicode_ci', title: 'Unicode (multilingual), case-insensitive' }, 
	ujis_bin: { value: 'ujis_bin', title: 'Japanese, Binary' }, 
	ujis_japanese_ci: { value: 'ujis_japanese_ci', title: 'Japanese, case-insensitive' }, 
	utf8_bin: { value: 'utf8_bin', title: 'Unicode (multilingual), Binary' }, 
	utf8_czech_ci: { value: 'utf8_czech_ci', title: 'Czech, case-insensitive' }, 
	utf8_danish_ci: { value: 'utf8_danish_ci', title: 'Danish, case-insensitive' }, 
	utf8_esperanto_ci: { value: 'utf8_esperanto_ci', title: 'Esperanto, case-insensitive' }, 
	utf8_estonian_ci: { value: 'utf8_estonian_ci', title: 'Estonian, case-insensitive' }, 
	utf8_general_ci: { value: 'utf8_general_ci', title: 'Unicode (multilingual), case-insensitive' }, 
	utf8_hungarian_ci: { value: 'utf8_hungarian_ci', title: 'Hungarian, case-insensitive' }, 
	utf8_icelandic_ci: { value: 'utf8_icelandic_ci', title: 'Icelandic, case-insensitive' }, 
	utf8_latvian_ci: { value: 'utf8_latvian_ci', title: 'Latvian, case-insensitive' }, 
	utf8_lithuanian_ci: { value: 'utf8_lithuanian_ci', title: 'Lithuanian, case-insensitive' }, 
	utf8_persian_ci: { value: 'utf8_persian_ci', title: 'Persian, case-insensitive' }, 
	utf8_polish_ci: { value: 'utf8_polish_ci', title: 'Polish, case-insensitive' }, 
	utf8_roman_ci: { value: 'utf8_roman_ci', title: 'West European, case-insensitive' }, 
	utf8_romanian_ci: { value: 'utf8_romanian_ci', title: 'Romanian, case-insensitive' }, 
	utf8_slovak_ci: { value: 'utf8_slovak_ci', title: 'Slovak, case-insensitive' }, 
	utf8_slovenian_ci: { value: 'utf8_slovenian_ci', title: 'Slovenian, case-insensitive' }, 
	utf8_spanish2_ci: { value: 'utf8_spanish2_ci', title: 'Traditional Spanish, case-insensitive' }, 
	utf8_spanish_ci: { value: 'utf8_spanish_ci', title: 'Spanish, case-insensitive' }, 
	utf8_swedish_ci: { value: 'utf8_swedish_ci', title: 'Swedish, case-insensitive' }, 
	utf8_turkish_ci: { value: 'utf8_turkish_ci', title: 'Turkish, case-insensitive' }, 
	utf8_unicode_ci: { value: 'utf8_unicode_ci', title: 'Unicode (multilingual), case-insensitive' }
};









cabin.data.collations_array = [
	{ value: 'armscii8_bin', title: 'Armenian, Binary' }, 
	{ value: 'armscii8_general_ci', title: 'Armenian, case-insensitive' }, 
	{ value: 'ascii_bin', title: 'West European (multilingual), Binary' }, 
	{ value: 'ascii_general_ci', title: 'West European (multilingual), case-insensitive' }, 
	{ value: 'big5_bin', title: 'Traditional Chinese, Binary' }, 
	{ value: 'big5_chinese_ci', title: 'Traditional Chinese, case-insensitive' }, 
	{ value: 'binary', title: 'Binary' }, 
	{ value: 'cp1250_bin', title: 'Central European (multilingual), Binary' }, 
	{ value: 'cp1250_croatian_ci', title: 'Croatian, case-insensitive' }, 
	{ value: 'cp1250_czech_cs', title: 'Czech, case-sensitive' }, 
	{ value: 'cp1250_general_ci', title: 'Central European (multilingual), case-insensitive' }, 
	{ value: 'cp1250_polish_ci', title: 'Polish, case-insensitive' }, 
	{ value: 'cp1251_bin', title: 'Cyrillic (multilingual), Binary' }, 
	{ value: 'cp1251_bulgarian_ci', title: 'Bulgarian, case-insensitive' }, 
	{ value: 'cp1251_general_ci', title: 'Cyrillic (multilingual), case-insensitive' }, 
	{ value: 'cp1251_general_cs', title: 'Cyrillic (multilingual), case-sensitive' }, 
	{ value: 'cp1251_ukrainian_ci', title: 'Ukrainian, case-insensitive' }, 
	{ value: 'cp1256_bin', title: 'Arabic, Binary' }, 
	{ value: 'cp1256_general_ci', title: 'Arabic, case-insensitive' }, 
	{ value: 'cp1257_bin', title: 'Baltic (multilingual), Binary' }, 
	{ value: 'cp1257_general_ci', title: 'Baltic (multilingual), case-insensitive' }, 
	{ value: 'cp1257_lithuanian_ci', title: 'Lithuanian, case-insensitive' }, 
	{ value: 'cp850_bin', title: 'West European (multilingual), Binary' }, 
	{ value: 'cp850_general_ci', title: 'West European (multilingual), case-insensitive' }, 
	{ value: 'cp852_bin', title: 'Central European (multilingual), Binary' }, 
	{ value: 'cp852_general_ci', title: 'Central European (multilingual), case-insensitive' }, 
	{ value: 'cp866_bin', title: 'Russian, Binary' }, 
	{ value: 'cp866_general_ci', title: 'Russian, case-insensitive' }, 
	{ value: 'cp932_bin', title: 'Japanese, Binary' }, 
	{ value: 'cp932_japanese_ci', title: 'Japanese, case-insensitive' }, 
	{ value: 'dec8_bin', title: 'West European (multilingual), Binary' }, 
	{ value: 'dec8_swedish_ci', title: 'Swedish, case-insensitive' }, 
	{ value: 'eucjpms_bin', title: 'Japanese, Binary' }, 
	{ value: 'eucjpms_japanese_ci', title: 'Japanese, case-insensitive' }, 
	{ value: 'euckr_bin', title: 'Korean, Binary' }, 
	{ value: 'euckr_korean_ci', title: 'Korean, case-insensitive' }, 
	{ value: 'gb2312_bin', title: 'Simplified Chinese, Binary' }, 
	{ value: 'gb2312_chinese_ci', title: 'Simplified Chinese, case-insensitive' }, 
	{ value: 'gbk_bin', title: 'Simplified Chinese, Binary' }, 
	{ value: 'gbk_chinese_ci', title: 'Simplified Chinese, case-insensitive' }, 
	{ value: 'geostd8_bin', title: 'Georgian, Binary' }, 
	{ value: 'geostd8_general_ci', title: 'Georgian, case-insensitive' }, 
	{ value: 'greek_bin', title: 'Greek, Binary' }, 
	{ value: 'greek_general_ci', title: 'Greek, case-insensitive' }, 
	{ value: 'hebrew_bin', title: 'Hebrew, Binary' }, 
	{ value: 'hebrew_general_ci', title: 'Hebrew, case-insensitive' }, 
	{ value: 'hp8_bin', title: 'West European (multilingual), Binary' }, 
	{ value: 'hp8_english_ci', title: 'English, case-insensitive' }, 
	{ value: 'keybcs2_bin', title: 'Czech-Slovak, Binary' }, 
	{ value: 'keybcs2_general_ci', title: 'Czech-Slovak, case-insensitive' }, 
	{ value: 'koi8r_bin', title: 'Russian, Binary' }, 
	{ value: 'koi8r_general_ci', title: 'Russian, case-insensitive' }, 
	{ value: 'koi8u_bin', title: 'Ukrainian, Binary' }, 
	{ value: 'koi8u_general_ci', title: 'Ukrainian, case-insensitive' }, 
	{ value: 'latin1_bin', title: 'West European (multilingual), Binary' }, 
	{ value: 'latin1_danish_ci', title: 'Danish, case-insensitive' }, 
	{ value: 'latin1_general_ci', title: 'West European (multilingual), case-insensitive' }, 
	{ value: 'latin1_general_cs', title: 'West European (multilingual), case-sensitive' }, 
	{ value: 'latin1_german1_ci', title: 'German (dictionary), case-insensitive' }, 
	{ value: 'latin1_german2_ci', title: 'German (phone book), case-insensitive' }, 
	{ value: 'latin1_spanish_ci', title: 'Spanish, case-insensitive' }, 
	{ value: 'latin1_swedish_ci', title: 'Swedish, case-insensitive' }, 
	{ value: 'latin2_bin', title: 'Central European (multilingual), Binary' }, 
	{ value: 'latin2_croatian_ci', title: 'Croatian, case-insensitive' }, 
	{ value: 'latin2_czech_cs', title: 'Czech, case-sensitive' }, 
	{ value: 'latin2_general_ci', title: 'Central European (multilingual), case-insensitive' }, 
	{ value: 'latin2_hungarian_ci', title: 'Hungarian, case-insensitive' }, 
	{ value: 'latin5_bin', title: 'Turkish, Binary' }, 
	{ value: 'latin5_turkish_ci', title: 'Turkish, case-insensitive' }, 
	{ value: 'latin7_bin', title: 'Baltic (multilingual), Binary' }, 
	{ value: 'latin7_estonian_cs', title: 'Estonian, case-sensitive' }, 
	{ value: 'latin7_general_ci', title: 'Baltic (multilingual), case-insensitive' }, 
	{ value: 'latin7_general_cs', title: 'Baltic (multilingual), case-sensitive' }, 
	{ value: 'macce_bin', title: 'Central European (multilingual), Binary' }, 
	{ value: 'macce_general_ci', title: 'Central European (multilingual), case-insensitive' }, 
	{ value: 'macroman_bin', title: 'West European (multilingual), Binary' }, 
	{ value: 'macroman_general_ci', title: 'West European (multilingual), case-insensitive' }, 
	{ value: 'sjis_bin', title: 'Japanese, Binary' }, 
	{ value: 'sjis_japanese_ci', title: 'Japanese, case-insensitive' }, 
	{ value: 'swe7_bin', title: 'Swedish, Binary' }, 
	{ value: 'swe7_swedish_ci', title: 'Swedish, case-insensitive' }, 
	{ value: 'tis620_bin', title: 'Thai, Binary' }, 
	{ value: 'tis620_thai_ci', title: 'Thai, case-insensitive' }, 
	{ value: 'ucs2_bin', title: 'Unicode (multilingual), Binary' }, 
	{ value: 'ucs2_czech_ci', title: 'Czech, case-insensitive' }, 
	{ value: 'ucs2_danish_ci', title: 'Danish, case-insensitive' }, 
	{ value: 'ucs2_esperanto_ci', title: 'Esperanto, case-insensitive' }, 
	{ value: 'ucs2_estonian_ci', title: 'Estonian, case-insensitive' }, 
	{ value: 'ucs2_general_ci', title: 'Unicode (multilingual), case-insensitive' }, 
	{ value: 'ucs2_hungarian_ci', title: 'Hungarian, case-insensitive' }, 
	{ value: 'ucs2_icelandic_ci', title: 'Icelandic, case-insensitive' }, 
	{ value: 'ucs2_latvian_ci', title: 'Latvian, case-insensitive' }, 
	{ value: 'ucs2_lithuanian_ci', title: 'Lithuanian, case-insensitive' }, 
	{ value: 'ucs2_persian_ci', title: 'Persian, case-insensitive' }, 
	{ value: 'ucs2_polish_ci', title: 'Polish, case-insensitive' }, 
	{ value: 'ucs2_roman_ci', title: 'West European, case-insensitive' }, 
	{ value: 'ucs2_romanian_ci', title: 'Romanian, case-insensitive' }, 
	{ value: 'ucs2_slovak_ci', title: 'Slovak, case-insensitive' }, 
	{ value: 'ucs2_slovenian_ci', title: 'Slovenian, case-insensitive' }, 
	{ value: 'ucs2_spanish2_ci', title: 'Traditional Spanish, case-insensitive' }, 
	{ value: 'ucs2_spanish_ci', title: 'Spanish, case-insensitive' }, 
	{ value: 'ucs2_swedish_ci', title: 'Swedish, case-insensitive' }, 
	{ value: 'ucs2_turkish_ci', title: 'Turkish, case-insensitive' }, 
	{ value: 'ucs2_unicode_ci', title: 'Unicode (multilingual), case-insensitive' }, 
	{ value: 'ujis_bin', title: 'Japanese, Binary' }, 
	{ value: 'ujis_japanese_ci', title: 'Japanese, case-insensitive' }, 
	{ value: 'utf8_bin', title: 'Unicode (multilingual), Binary' }, 
	{ value: 'utf8_czech_ci', title: 'Czech, case-insensitive' }, 
	{ value: 'utf8_danish_ci', title: 'Danish, case-insensitive' }, 
	{ value: 'utf8_esperanto_ci', title: 'Esperanto, case-insensitive' }, 
	{ value: 'utf8_estonian_ci', title: 'Estonian, case-insensitive' }, 
	{ value: 'utf8_general_ci', title: 'Unicode (multilingual), case-insensitive' }, 
	{ value: 'utf8_hungarian_ci', title: 'Hungarian, case-insensitive' }, 
	{ value: 'utf8_icelandic_ci', title: 'Icelandic, case-insensitive' }, 
	{ value: 'utf8_latvian_ci', title: 'Latvian, case-insensitive' }, 
	{ value: 'utf8_lithuanian_ci', title: 'Lithuanian, case-insensitive' }, 
	{ value: 'utf8_persian_ci', title: 'Persian, case-insensitive' }, 
	{ value: 'utf8_polish_ci', title: 'Polish, case-insensitive' }, 
	{ value: 'utf8_roman_ci', title: 'West European, case-insensitive' }, 
	{ value: 'utf8_romanian_ci', title: 'Romanian, case-insensitive' }, 
	{ value: 'utf8_slovak_ci', title: 'Slovak, case-insensitive' }, 
	{ value: 'utf8_slovenian_ci', title: 'Slovenian, case-insensitive' }, 
	{ value: 'utf8_spanish2_ci', title: 'Traditional Spanish, case-insensitive' }, 
	{ value: 'utf8_spanish_ci', title: 'Spanish, case-insensitive' }, 
	{ value: 'utf8_swedish_ci', title: 'Swedish, case-insensitive' }, 
	{ value: 'utf8_turkish_ci', title: 'Turkish, case-insensitive' }, 
	{ value: 'utf8_unicode_ci', title: 'Unicode (multilingual), case-insensitive' }
];