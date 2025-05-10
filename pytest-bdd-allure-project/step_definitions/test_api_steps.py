# pytest-bdd-allure-project/step_definitions/test_api_steps.py
import pytest
import requests
from pytest_bdd import scenarios, given, when, then, parsers
import allure # For Allure attachments and steps

# Load scenarios from the feature file
scenarios('../features/api_tests.feature')

# Constants
SWAPI_BASE_URL = 'https://swapi.dev/api'

# Fixture to store context between steps (e.g., API response)
@pytest.fixture
def api_context():
    """Fixture to hold context data like API responses between steps."""
    return {}

# When Steps
@when('I request the list of people from SWAPI', target_fixture="api_context")
@allure.step("When I request the list of people from SWAPI")
def request_list_of_people(api_context):
    """Requests the list of people from SWAPI."""
    try:
        response = requests.get(f"{SWAPI_BASE_URL}/people/")
        response.raise_for_status() # Raise an exception for bad status codes
        api_context['response'] = response
    except requests.exceptions.RequestException as e:
        allure.attach(str(e), name="APIRequestException", attachment_type=allure.attachment_type.TEXT)
        api_context['response'] = e.response if hasattr(e, 'response') else None # Store response if available
        pytest.fail(f"API request failed: {e}") # Fail test explicitly on request error
    allure.attach(response.text, name="PeopleListResponse", attachment_type=allure.attachment_type.JSON)
    return api_context


@when(parsers.parse('I request details for person ID {person_id:d} from SWAPI'), target_fixture="api_context")
@allure.step("When I request details for person ID {person_id} from SWAPI")
def request_person_details(api_context, person_id):
    """Requests details for a specific person ID from SWAPI."""
    try:
        response = requests.get(f"{SWAPI_BASE_URL}/people/{person_id}/")
        # No raise_for_status here, as we might expect 404 for one test case
        api_context['response'] = response
    except requests.exceptions.RequestException as e:
        allure.attach(str(e), name="APIRequestException", attachment_type=allure.attachment_type.TEXT)
        api_context['response'] = e.response if hasattr(e, 'response') else None
        pytest.fail(f"API request failed: {e}")
    allure.attach(response.text, name=f"Person_{person_id}_Response", attachment_type=allure.attachment_type.JSON)
    return api_context

@when(parsers.parse('I request details for a non-existent person ID {person_id:d} from SWAPI'), target_fixture="api_context")
@allure.step("When I request details for a non-existent person ID {person_id} from SWAPI")
def request_non_existent_person(api_context, person_id):
    """Requests details for a non-existent person ID."""
    # This step is essentially the same as the one above, just for clarity in the feature file
    return request_person_details(api_context, person_id)


@when(parsers.parse('I search for people with name "{search_name}" in SWAPI'), target_fixture="api_context")
@allure.step('When I search for people with name "{search_name}" in SWAPI')
def search_people_by_name(api_context, search_name):
    """Searches for people by name in SWAPI."""
    try:
        response = requests.get(f"{SWAPI_BASE_URL}/people/?search={search_name}")
        response.raise_for_status()
        api_context['response'] = response
    except requests.exceptions.RequestException as e:
        allure.attach(str(e), name="APIRequestException", attachment_type=allure.attachment_type.TEXT)
        api_context['response'] = e.response if hasattr(e, 'response') else None
        pytest.fail(f"API request failed: {e}")
    allure.attach(response.text, name=f"Search_{search_name}_Response", attachment_type=allure.attachment_type.JSON)
    return api_context

# Then Steps
@then(parsers.parse('the SWAPI response status should be {status_code:d}'))
@allure.step("Then the SWAPI response status should be {status_code}")
def verify_response_status(api_context, status_code):
    """Verifies the HTTP status code of the API response."""
    response = api_context.get('response')
    assert response is not None, "API response not found in context"
    assert response.status_code == status_code
    allure.attach(f"Actual status: {response.status_code}", name="ResponseStatusVerification")

@then('the SWAPI response should contain a list of people')
@allure.step("Then the SWAPI response should contain a list of people")
def verify_list_of_people(api_context):
    """Verifies that the API response contains a list of people."""
    response_json = api_context['response'].json()
    assert 'results' in response_json
    assert isinstance(response_json['results'], list)
    assert len(response_json['results']) > 0
    allure.attach(str(response_json['results'][0] if response_json['results'] else "Empty list"), name="FirstPersonInList")

@then(parsers.parse('the person\'s name should be "{expected_name}"'))
@allure.step('Then the person\'s name should be "{expected_name}"')
def verify_person_name(api_context, expected_name):
    """Verifies the name of the person in the API response."""
    response_json = api_context['response'].json()
    assert response_json.get('name') == expected_name
    allure.attach(f"Actual name: {response_json.get('name')}", name="PersonNameVerification")

@then(parsers.parse('the SWAPI response detail should be "{expected_detail}"'))
@allure.step('Then the SWAPI response detail should be "{expected_detail}"')
def verify_response_detail(api_context, expected_detail):
    """Verifies the 'detail' field in the API response (e.g., for 404)."""
    response_json = api_context['response'].json()
    assert response_json.get('detail') == expected_detail
    allure.attach(f"Actual detail: {response_json.get('detail')}", name="ResponseDetailVerification")

@then(parsers.parse('the SWAPI search results should contain people named "{search_name}"'))
@allure.step('Then the SWAPI search results should contain people named "{search_name}"')
def verify_search_results_name(api_context, search_name):
    """Verifies that search results contain people with the given name."""
    response_json = api_context['response'].json()
    assert 'results' in response_json and len(response_json['results']) > 0
    found = any(search_name.lower() in person.get('name', '').lower() for person in response_json['results'])
    assert found, f"No person found with name containing '{search_name}'"
    allure.attach(str([p.get('name') for p in response_json['results']]), name="FoundNames")
