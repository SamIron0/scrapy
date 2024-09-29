import pytest
from app.scraper import verify_url, clean_html

def test_verify_url():
    assert verify_url("https://www.example.com") == True
    assert verify_url("http://localhost:8000") == True
    assert verify_url("ftp://ftp.example.com") == True
    assert verify_url("not_a_url") == False
    assert verify_url("www.example.com") == False

def test_clean_html():
    html_content = """
    <html>
        <head><script>Some script</script></head>
        <body>
            <header>Header content</header>
            <div>Main content</div>
            <footer>Footer content</footer>
        </body>
    </html>
    """
    cleaned_text = clean_html(html_content)
    assert "Main content" in cleaned_text
    assert "Header content" not in cleaned_text
    assert "Footer content" not in cleaned_text
    assert "Some script" not in cleaned_text
