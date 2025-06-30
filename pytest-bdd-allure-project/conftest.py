import os
import pytest

def pytest_collection_modifyitems(config, items):
    """
    This hook is called after test collection has been performed.
    You can modify the list of collected items.
    """
    test_case_ids = os.environ.get("AGENT_AZDO_TEST_CASES_IDS")
    test_case_names = os.environ.get("AGENT_AZDO_TEST_CASES_NAMES")

    print(f"DEBUG: AGENT_AZDO_TEST_CASES_IDS: {test_case_ids}")
    print(f"DEBUG: AGENT_AZDO_TEST_CASES_NAMES: {test_case_names}")

    if not test_case_ids and not test_case_names:
        return

    selected_items = []
    deselected_items = []

    should_filter = False
    if test_case_ids:
        should_filter = True
        ids = [f"{item.strip()}" for item in test_case_ids.split(",")]
        print(f"DEBUG: Filtering by IDs: {ids}")
        selected_by_id = set()
        for item in items:
            item_markers = [marker.name for marker in item.own_markers]
            print(f"DEBUG: Item: {item.name}, Markers: {item_markers}")
            if any(marker_name in ids for marker_name in item_markers):
                selected_by_id.add(item)
    else:
        selected_by_id = set(items)

    if test_case_names:
        should_filter = True
        names = [item.strip() for item in test_case_names.split(",")]
        print(f"DEBUG: Filtering by Names: {names}")
        selected_by_name = set()
        for item in items:
            print(f"DEBUG: Item: {item.name}")
            if any(name in item.name for name in names):
                selected_by_name.add(item)
    else:
        selected_by_name = set(items)

    # If both are provided, take the intersection. Otherwise, use the set from the single provided filter.
    if test_case_ids and test_case_names:
        selected_items = list(selected_by_id.intersection(selected_by_name))
    elif test_case_ids:
        selected_items = list(selected_by_id)
    elif test_case_names:
        selected_items = list(selected_by_name)
    else:
        selected_items = items # No filters, run all tests

    print(f"DEBUG: Selected items count: {len(selected_items)}")
    for item in selected_items:
        print(f"DEBUG: Selected item: {item.name}")

    if should_filter and not selected_items:
        # If a filter was applied but no tests matched, deselect all tests
        print("DEBUG: No tests matched the filter criteria. Deselecting all tests.")
        items[:] = []
        config.hook.pytest_deselected(items=items)
    elif selected_items:
        items[:] = selected_items
        deselected_items = [item for item in items if item not in selected_items]
        if deselected_items:
            print(f"DEBUG: Deselected items count: {len(deselected_items)}")
            for item in deselected_items:
                print(f"DEBUG: Deselected item: {item.name}")
            config.hook.pytest_deselected(items=deselected_items)