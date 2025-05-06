from cleantext import clean

def clean_text(text, **kwargs):
    return clean(
        text,
        fix_unicode=True,
        to_ascii=kwargs.get('to_ascii', False),
        lower=kwargs.get('lower', False),
        no_line_breaks=kwargs.get('no_line_breaks', False),
        no_urls=kwargs.get('no_urls', False),
        no_emails=kwargs.get('no_emails', False),
        no_phone_numbers=kwargs.get('no_phone_numbers', False),
        no_numbers=kwargs.get('no_numbers', False),
        no_digits=kwargs.get('no_digits', False),
        no_currency_symbols=kwargs.get('no_currency_symbols', False),
        no_punct=kwargs.get('no_punct', False),
        no_emoji=kwargs.get('no_emoji', False),
        normalize_whitespace=kwargs.get('normalize_whitespace', True),
    )
