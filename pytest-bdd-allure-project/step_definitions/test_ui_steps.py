# pytest-bdd-allure-project/step_definitions/test_ui_steps.py
import pytest
from pytest_bdd import scenarios, given, when, then, parsers
import allure # For Allure attachments and steps
import re # For regular expressions
from playwright.sync_api import expect # Playwright's expect for assertions

# Load scenarios from the feature file
scenarios('../features/ui_tests.feature')

# Constants
PLAYWRIGHT_DEV_URL = 'https://playwright.dev/'

# Given Steps
@given('I am on the Playwright dev page')
@allure.step("Given I am on the Playwright dev page")
def go_to_playwright_page(page): # 'page' fixture is provided by pytest-playwright
    """Navigates to the Playwright dev page."""
    page.goto(PLAYWRIGHT_DEV_URL)
    allure.attach(page.screenshot(type="png"), name="PlaywrightHomepage", attachment_type=allure.attachment_type.PNG)

# When Steps
@when('I click the "Get started" link')
@allure.step('When I click the "Get started" link')
def click_get_started_link(page):
    """Clicks the 'Get started' link."""
    # Playwright's auto-waiting is generally good.
    # Using get_by_role for better semantics if possible.
    get_started_button = page.get_by_role("link", name="Get started", exact=False)
    expect(get_started_button).to_be_visible()
    get_started_button.click()
    allure.attach(page.screenshot(type="png"), name="AfterClickGetStarted", attachment_type=allure.attachment_type.PNG)

@when('I click the search button on the main page')
@allure.step('When I click the search button on the main page')
def click_main_search_button(page):
    """Clicks the main search button to open the search modal."""
    # This selector might need to be very specific to the website's structure
    search_button = page.get_by_role("button", name="Search (Command+K)")
    expect(search_button).to_be_visible(timeout=10000)
    search_button.click()
    allure.attach(page.screenshot(type="png"), name="SearchModalOpened", attachment_type=allure.attachment_type.PNG)


@when(parsers.parse('I type "{search_term}" into the search input'))
@allure.step('When I type "{search_term}" into the search input')
def type_into_search_input(page, search_term):
    """Types the given term into the search input field."""
    # Using get_by_placeholder for better semantics
    search_input = page.get_by_placeholder("Search docs") # Adjust placeholder text if different
    expect(search_input).to_be_visible(timeout=10000)
    search_input.fill(search_term)
    allure.attach(page.screenshot(type="png"), name=f"Typed_{search_term}", attachment_type=allure.attachment_type.PNG)

# Then Steps
@then(parsers.parse('the page title should contain "{expected_title_part}"'))
@allure.step("Then the page title should contain \"{expected_title_part}\"")
def verify_page_title(page, expected_title_part):
    """Verifies that the page title contains the expected text."""
    expect(page).to_have_title(re.compile(expected_title_part), timeout=10000) # Using Playwright's built-in assertion

    allure.attach(f"Actual title: {page.title()}", name="PageTitleVerification")

@then(parsers.parse('the URL should contain "{expected_url_part}"'))
@allure.step('Then the URL should contain "{expected_url_part}"')
def verify_url_contains(page, expected_url_part):
    """Verifies that the current URL contains the expected part."""
    expect(page).to_have_url(re.compile(expected_url_part), timeout=10000) # Using Playwright's built-in assertion with glob pattern
    allure.attach(f"Actual URL: {page.url}", name="URLVerification")

@then(parsers.parse('I should see search results containing "{expected_text}"'))
@allure.step('Then I should see search results containing "{expected_text}"')
def verify_search_results(page, expected_text):
    """Verifies that search results contain the expected text."""
    # This selector will depend heavily on the actual website structure
    # Using a more Playwright-idiomatic selector
    first_result_locator = page.locator('.DocSearch-Hit a').first # Adjust selector
    
    expect(first_result_locator).to_be_visible(timeout=15000)
    expect(first_result_locator).to_contain_text(expected_text, ignore_case=True)
    allure.attach(page.screenshot(type="png"), name="SearchResults", attachment_type=allure.attachment_type.PNG)
    allure.attach(f"First result text: {first_result_locator.text_content()}", name="FirstSearchResultText")

