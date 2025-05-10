# pytest-bdd-allure-project/conftest.py
import pytest
import allure

# The pytest-playwright plugin automatically provides fixtures like 'page', 'context', 'browser', etc.
# So, we don't need to define a custom browser fixture as we did for Selenium.
# However, we might want to configure browser launch options or other settings.

# Example: If you need to customize browser launch options (e.g., headless)
# This can often be done via command-line arguments or pytest.ini with pytest-playwright
# For instance, to run headless, you'd typically run: pytest --headed False

# Hook to add environment info to Allure report
def pytest_configure(config):
    """
    Adds custom environment information to the Allure report.
    """
    if hasattr(config, '_allure_report_environment'): # Check if Allure plugin is active
        # These are automatically added by pytest-playwright if available
        # config._allure_report_environment['Browser'] = browser_name  # e.g., chromium
        # config._allure_report_environment['Browser.Version'] = browser_version
        config._allure_report_environment['TestFramework'] = 'Pytest-BDD with Playwright'
        config._allure_report_environment['OS'] = 'Linux (CI Agent)' # Example
        # You can add more dynamic info here

# You can also use hooks provided by pytest-playwright if needed, for example:
# @pytest.hookimpl(tryfirst=True)
# def pytest_bdd_before_scenario(request, feature, scenario):
#     """
#     Called before scenario is executed.
#     """
#     page = request.getfixturevalue("page") # Get the Playwright page fixture
#     # You could potentially do some setup here if needed globally for scenarios

@pytest.fixture(scope="session", autouse=True)
def install_playwright_browsers(request):
    """
    Ensures Playwright browsers are installed.
    This is more of a convenience for local setup. In CI, browsers
    are often pre-installed or installed via a dedicated pipeline step.
    `pytest-playwright` typically handles ensuring browsers are present
    or provides commands to install them (e.g., `playwright install`).
    This fixture is a proactive check/attempt.
    """
    # This step is often handled by running `playwright install` or `pytest --browser chromium --browser firefox --browser webkit playwright install`
    # For simplicity in this example, we'll assume browsers are managed by `playwright install` command run separately
    # or by pytest-playwright's capabilities.
    # If you need to force it:
    # import subprocess
    # try:
    #     print("Ensuring Playwright browsers are installed...")
    #     subprocess.run(["playwright", "install", "chromium"], check=True, capture_output=True, text=True) # Install specific browser like chromium
    #     print("Playwright browsers (chromium) should be up to date.")
    # except subprocess.CalledProcessError as e:
    #     print(f"Error installing Playwright browsers: {e.stderr}")
    #     pytest.skip("Playwright browsers could not be installed automatically.")
    # except FileNotFoundError:
    #     pytest.skip("Playwright CLI not found. Please install browsers manually with 'playwright install'.")
    pass # pytest-playwright handles browser management well.

# If you need to take screenshots for Allure on test failure,
# pytest-playwright often handles this automatically when used with Allure.
# If not, you can implement a hook:
@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == 'call' and report.failed:
        if "page" in item.funcargs: # Check if 'page' fixture is used by the test
            page = item.funcargs["page"]
            try:
                allure.attach(
                    page.screenshot(type="png"),
                    name=f"screenshot_on_failure_{item.name}",
                    attachment_type=allure.attachment_type.PNG
                )
            except Exception as e:
                print(f"Failed to take screenshot: {e}")

