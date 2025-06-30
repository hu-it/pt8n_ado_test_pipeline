import os
import pytest

def pytest_collection_modifyitems(config, items):
    """
    This hook is called after test collection has been performed.
    You can modify the list of collected items.
    """
    test_case_ids = os.environ.get("AGENT_AZDO_TEST_CASES_IDS")
    test_case_names = os.environ.get("AGENT_AZDO_TEST_CASES_NAMES")

    if not test_case_ids and not test_case_names:
        return

    selected_items = []
    deselected_items = []

    if test_case_ids:
        ids = [item.strip() for item in test_case_ids.split(",")]
        for item in items:
            if any(marker.name in ids for marker in item.own_markers):
                selected_items.append(item)
            else:
                deselected_items.append(item)

    if test_case_names:
        names = [item.strip() for item in test_case_names.split(",")]
        if not selected_items:  # If not already filtered by ID
            for item in items:
                if any(name in item.name for name in names):
                    selected_items.append(item)
                else:
                    deselected_items.append(item)
        else: # If already filtered by ID, filter again by name
            new_selected_items = []
            for item in selected_items:
                if any(name in item.name for name in names):
                    new_selected_items.append(item)
                else:
                    deselected_items.append(item)
            selected_items = new_selected_items

    if selected_items:
        items[:] = selected_items
        config.hook.pytest_deselected(items=deselected_items)