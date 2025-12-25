import os

def get_secret(name: str, default=None, required: bool = False):
    """Retrieve secret from environment variables.

    Args:
        name: Environment variable name.
        default: Fallback value if variable is not set.
        required: If True, raise RuntimeError when value is missing/empty.

    Returns:
        The secret value (str) or the provided default.

    Raises:
        RuntimeError: when required is True and the environment variable is missing.
    """
    val = os.getenv(name, default)
    if required and (val is None or val == ""):
        raise RuntimeError(f"Missing required secret: {name}")
    return val
